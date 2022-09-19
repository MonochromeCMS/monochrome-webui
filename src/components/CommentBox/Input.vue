<script setup lang="ts">
import { mdiClose, mdiSend } from '@mdi/js'
import type { CommentSchema, DetailedCommentResponse } from '@/api/Comment'
import { Comment } from '@/api/Comment'

const props = defineProps<{
  chapterId: string
  replyTo: DetailedCommentResponse | null
}>()

const emits = defineEmits<{
  (e: 'update:replyTo', value: DetailedCommentResponse): void
  (e: 'send', value: CommentSchema): void
}>()

const { t } = useI18n()
const auth = useAuth()

const replyTo = useVModel(props, 'replyTo', emits)

const successMsg = ref('')
const content = ref('')

const canCreate = computed(() => Comment.canCreate(auth.role))
const params = computed(() => ({
  chapterId: props.chapterId,
  content: content.value,
  replyTo: replyTo.value?.id ?? null,
} as CommentSchema))

function success() {
  successMsg.value = t('successComment')
  content.value = ''
}

function sendComment() {
  if (content.value)
    emits('send', params.value)
}

defineExpose({ success })
</script>

<template>
  <div>
    <v-card v-if="replyTo" color="background" class="mb-3" style="position: relative">
      <v-card-title class="text-h6">
        {{ t('replyingTo', { username: replyTo.author.username }) }}
      </v-card-title>
      <v-card-text>
        {{ replyTo.content }}
      </v-card-text>
      <v-btn icon variant="text" class="close-icon" @click="replyTo = null">
        <v-icon :icon="mdiClose" />
      </v-btn>
    </v-card>
    <v-textarea
      v-if="canCreate"
      v-model="content"
      :append-icon="mdiSend"
      :label="t('inputLabel')"
      :success="successMsg"
      hide-details="auto"
      rows="3"
      auto-grow
      no-resize
      @click:append="sendComment"
    />
    <div v-else class="background pa-3 text-center">
      <router-link to="/login" class="text-decoration-none">
        {{ t("login") }}
      </router-link>
      {{ t('toPostComment') }}
    </div>
  </div>
</template>

<style scoped>
.close-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>

<i18n locale="en" lang="yaml">
login: Log in
toPostComment: to add a comment.
successComment: Comment added
inputLabel: Add a comment
replyingTo: 'Replying to {username}'
</i18n>

<i18n locale="fr" lang="yaml">
login: Connecte-toi
toPostComment: pour ajouter un commentaire.
successComment: Commentaire ajouté
inputLabel: Ajouter un commentaire
replyingTo: 'Répondre à {username}'
</i18n>
