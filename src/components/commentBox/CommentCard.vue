<template>
  <v-card class="ma-0 pa-3" flat>
    <div class="d-flex">
      <v-img
        :lazy-src="defAvatar"
        :src="avatar"
        width="3rem"
        height="3rem"
        class="mr-4 rounded-circle"
      />
      <div style="width: 100%; margin-right: 8px">
        <div class="text--secondary">{{ comment.author.username }}</div>
        <div>
          <v-card v-if="comment.replyTo" color="background" class="reply pa-3 my-3 font-italic">
            {{ replyContent }}
          </v-card>
          <comment-edit-input
            v-if="editing"
            :comment="comment"
            @close="editing = false"
            @update="update"
          />
          <div v-else>
            {{ comment.content }}
          </div>
        </div>
      </div>
      <comment-card-actions
        :can-edit="canEdit"
        @reply="reply"
        @delete="deleteComment"
        @edit="editing = true"
      />
    </div>
    <div class="text-right text--secondary">
      {{ $t('timeAgo', { time: ago(new Date(comment.createTime).getTime()) }) }}
      <span v-if="comment.version > 1" class="font-italic">({{ $t('edited') }})</span>
    </div>
  </v-card>
</template>

<script lang="ts">
import type { AxiosRequestConfig } from 'axios';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

import type { DetailedCommentResponse } from '@/api/Comment';
import Comment from '@/api/Comment';
import Media from '@/api/Media';
import type { Role } from '@/api/User';
import CommentCardActions from '@/components/commentBox/CommentCardActions.vue';
import CommentEditInput from '@/components/commentBox/CommentEditInput.vue';
@Component({
  components: { CommentCardActions, CommentEditInput },
})
export default class CommentCard extends Vue {
  @Prop() comment!: DetailedCommentResponse;

  defAvatar = Media.defaultAvatar;

  editing = false;

  replyContent = '...';

  get avatar(): string {
    return Media.avatar(this.comment.authorId, this.comment.author.version);
  }

  get userId(): string {
    return this.$store.getters.userId;
  }

  get userRole(): Role {
    return this.$store.getters.userRole;
  }

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig;
  }

  get canEdit(): boolean {
    return Comment.canEdit(this.comment, this.userId, this.userRole);
  }

  @Emit('reply')
  reply(): DetailedCommentResponse {
    return this.comment;
  }

  @Emit('update')
  update(): boolean {
    return true;
  }

  ago(val: number): string {
    val = 0 | ((Date.now() - val) / 1000);

    const length = new Map([
      ['second', 60],
      ['minute', 60],
      ['hour', 24],
      ['day', 7],
      ['week', 4.35],
      ['month', 12],
      ['year', 10000],
    ]);

    for (const [k, l] of length) {
      const result = val % l;
      if (!(val = 0 | (val / l))) {
        return this.$tc(`timeUnits.${k}`, result);
      }
    }
    return 'ERROR';
  }

  async getReply() {
    if (!this.comment.replyTo) {
      return;
    }

    const response = await Comment.get(this.comment.replyTo);

    if (response.data) {
      this.replyContent = response.data.content;
    } else {
      this.replyContent = this.$tc('deletedReply');
    }
  }

  async deleteComment(): Promise<void> {
    const response = await Comment.delete(this.comment.id, this.authConfig);

    if (response.data) {
      this.update();
    } else {
      const notification = {
        color: 'error',
        context: this.$t('deleteComment'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
  }

  mounted() {
    this.getReply();
  }
}
</script>

<style lang="scss">
.theme--dark {
  .reply {
    border-left: 2px solid white !important;
  }
}
.theme--light {
  .reply {
    border-left: 2px solid black !important;
  }
}
</style>

<i18n locale="en" lang="yaml">
edited: 'edited'
deletedReply: 'Deleted comment.'
deleteComment: 'Delete comment'
</i18n>

<i18n locale="fr" lang="yaml">
edited: 'modifié'
deletedReply: 'Commentaire supprimé.'
deleteComment: 'Suppression de commentaire'
</i18n>
