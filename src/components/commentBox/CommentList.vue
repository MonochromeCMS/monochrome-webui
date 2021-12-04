<template>
  <div>
    <div>
      <loading-comment-card v-if="loading" class="comment-card" />
      <div v-else-if="comments.length === 0" class="text-body-1 text-center">
        {{ $t('noComments') }}
      </div>
      <comment-card
        v-for="comment in comments"
        v-else
        :key="comment.id"
        :comment="comment"
        class="comment-card"
        @reply="setReply"
        @update="refresh"
      />
    </div>
    <v-pagination
      v-if="pageAmount > 1"
      v-model="page"
      class="mx-auto mt-2"
      color="background text--primary"
      :length="pageAmount"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator';

import Chapter from '@/api/Chapter';
import type { DetailedCommentResponse } from '@/api/Comment';
import CommentCard from '@/components/commentBox/CommentCard.vue';
import LoadingCommentCard from '@/components/commentBox/LoadingCommentCard.vue';

@Component({
  components: { CommentCard, LoadingCommentCard },
})
export default class CommentList extends Vue {
  @Prop(String) chapterId!: string;

  @PropSync('replyTo') replyToSync!: DetailedCommentResponse | null;

  comments: DetailedCommentResponse[] = [];

  loading = true;

  page = 1;

  limit = 8;

  total = 0;

  get pageAmount(): number {
    return Math.ceil(this.total / this.limit);
  }

  get offset(): number {
    return (this.page - 1) * this.limit;
  }

  @Watch('chapterId')
  onChapterChange(): void {
    this.refresh();
  }

  @Watch('page')
  onPageChange(): void {
    this.getComments();
  }

  setReply(reply: DetailedCommentResponse): void {
    this.replyToSync = reply;
    const scroll = () => window.scrollTo({ behavior: 'smooth', top: document.body.scrollHeight });

    setTimeout(scroll, 100);
  }

  refresh(): void {
    this.replyToSync = null;
    if (this.page === 1) {
      this.getComments();
    } else {
      this.page = 1;
    }
  }

  public async getComments(): Promise<void> {
    const response = await Chapter.getComments(this.chapterId, this.limit, this.offset);

    if (response.data) {
      this.comments = response.data.results;
      this.total = response.data.total;
    } else {
      const notification = {
        color: 'error',
        context: this.$t('getComments'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
    }

    this.loading = false;
  }

  mounted(): void {
    this.getComments();
  }
}
</script>

<style lang="scss">
.theme--dark {
  .comment-card {
    background-color: #212121;
    border-bottom: rgba(255, 255, 255, 0.12) 0.1rem solid;
    border-radius: 0;
    &:first-child {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    &:last-child {
      border-bottom: none;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
}
.theme--light {
  .comment-card {
    background: #ffffff;
    border-bottom: rgba(0, 0, 0, 0.12) 0.1rem solid;
    border-radius: 0;
    &:first-child {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    &:last-child {
      border-bottom: none;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
}
</style>

<i18n locale="en" lang="yaml">
noComments: 'No comments yet.'
</i18n>

<i18n locale="fr" lang="yaml">
noComments: "Aucun commentaire pour l'instant."
</i18n>
