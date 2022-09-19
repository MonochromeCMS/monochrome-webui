<script setup lang="ts">
import CommentBoxInput from './Input.vue'
import CommentBoxList from './List.vue'
import { Comment } from '@/api/Comment'
import type { CommentSchema, DetailedCommentResponse } from '@/api/Comment'

defineProps<{
  chapterId: string
}>()

const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()

const input = ref<InstanceType<typeof CommentBoxInput>>()
const list = ref<InstanceType<typeof CommentBoxList>>()

const replyTo = ref(null as DetailedCommentResponse | null)

async function sendComment(params: CommentSchema) {
  const response = await Comment.create(params, auth.config)

  if (response.data !== null) {
    input.value?.success()
    list.value?.refresh()
  }
  else {
    notifications.create('error', t('addComment'), response.error)
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12" sm="10" md="8" lg="6" class="mx-auto mb-3">
      <v-card color="backgroundAlt" flat>
        <v-card-title class="text-center lemon-milk">
          {{ t("comments") }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <CommentBoxList ref="list" v-model:reply-to="replyTo" :chapter-id="chapterId" />
          <v-divider class="my-3" />
          <CommentBoxInput
            ref="input"
            v-model:reply-to="replyTo"
            :chapter-id="chapterId"
            @send="sendComment"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<i18n locale="en" lang="yaml">
comments: Comments
addComment: Add comment
</i18n>

<i18n locale="fr" lang="yaml">
comments: Commentaires
addComment: Ajouter commentaire
</i18n>
