<script setup lang="ts">
import { Comment } from '@/api/Comment'
import type { DetailedCommentResponse } from '@/api/Comment'
import { Media } from '@/api/Media'

const props = defineProps<{
  comment: DetailedCommentResponse
}>()

const emits = defineEmits<{
  (e: 'reply', value: DetailedCommentResponse): void
  (e: 'update'): void
}>()

const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()
const agoText = useAgo(new Date(props.comment.createTime), 5000)

const editing = ref(false)
const replyContent = ref('...')

const avatar = computed(() => Media.avatar(props.comment.authorId, props.comment.author.version))
const canEdit = computed(() => Comment.canEdit(props.comment, auth.id, auth.role))
const canCreate = computed(() => Comment.canCreate(auth.role))

async function getReply() {
  if (!props.comment.replyTo)
    return

  const response = await Comment.get(props.comment.replyTo)

  if (response.data !== null)
    replyContent.value = response.data.content
  else if (response.status === 404)
    replyContent.value = t('deletedReply')
  else
    notifications.create('error', t('getComment'), response.error)
}

async function deleteComment() {
  const response = await Comment.delete(props.comment.id, auth.config)

  if (response.data !== null)
    emits('update')
  else
    notifications.create('error', t('deleteComment'), response.error)
}

watchEffect(getReply)
</script>

<template>
  <v-card class="comment-card py-3" rounded="0" flat>
    <div class="d-flex">
      <v-avatar class="user-avatar mr-4">
        <v-img :lazy-src="Media.defaultAvatar" :src="avatar" />
      </v-avatar>
      <div class="w-100 mr-2">
        <div class="text-secondary">
          {{ comment.author.username }}
        </div>
        <div>
          <v-card v-if="comment.replyTo" color="background" class="reply pa-3 py-3 my-2 font-italic">
            {{ replyContent }}
          </v-card>
          <comment-box-card-edit v-if="editing" :comment="comment" @close="editing = false" @update="emits('update')" />
          <div v-else class="mt-1">
            {{ comment.content }}
          </div>
        </div>
      </div>
      <comment-box-card-actions :can-edit="canEdit" :can-create="canCreate" @reply="emits('reply', comment)" @delete="deleteComment" @edit="editing = true" />
    </div>
    <div class="text-right text-secondary">
      {{ agoText }}
      <span v-if="comment.version > 1" class="font-italic">({{ t("edited") }})</span>
    </div>
  </v-card>
</template>

<style lang="scss">
.reply {
  border-left: 2px solid rgb(var(--v-theme-primary)) !important;
}
.user-avatar .v-img__img--preload {
  filter: none !important;
}
.comment-card + .comment-card {
  border-top: 1px solid rgba(var(--v-theme-secondary), 0.2);
}
</style>

<i18n locale="en" lang="yaml">
edited: edited
deletedReply: Deleted comment.
deleteComment: Delete comment
</i18n>

<i18n locale="fr" lang="yaml">
edited: modifié
deletedReply: Commentaire supprimé.
deleteComment: Suppression de commentaire
</i18n>
