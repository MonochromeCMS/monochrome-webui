<script setup lang="ts">
import { mdiCheck, mdiClose } from '@mdi/js'
import type { CommentEditSchema, CommentResponse } from '@/api/Comment'
import { Comment } from '@/api/Comment'

const props = defineProps<{
  comment: CommentResponse
}>()

const emits = defineEmits<{
  (e: 'update'): void
  (e: 'close'): void
}>()

const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()

const params = reactive({
  content: '',
} as CommentEditSchema)

async function editComment() {
  const response = await Comment.edit(props.comment.id, params, auth.config)

  if (response.data !== null) {
    emits('close')
    emits('update')
  }
  else {
    notifications.create('error', t('commentEdit'), response.error)
  }
}

watchEffect(() => {
  params.content = props.comment.content
})
</script>

<template>
  <v-textarea
    v-model="params.content"
    :label="t('inputLabel')"
    :append-inner-icon="mdiClose"
    :append-icon="mdiCheck"
    hide-details
    no-resize
    auto-grow
    rows="1"
    @click:append="editComment"
    @click:append-inner="emits('close')"
  />
</template>

<i18n locale="en" lang="yaml">
commentEdit: Edit comment
inputLabel: Edit the comment
</i18n>

<i18n locale="fr" lang="yaml">
commentEdit: Modifier le commentaire
inputLabel: Modifie le comment
</i18n>
