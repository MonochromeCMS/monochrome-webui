<script setup lang="ts">
import type { DetailedCommentResponse } from '@/api/Comment'

const props = defineProps<{
  chapterId: string
  replyTo: DetailedCommentResponse | null
}>()

const emits = defineEmits<{
  (event: 'update:replyTo', value: DetailedCommentResponse): void
}>()

const { t } = useI18n()
const notifications = useNotifications()

const replyTo = useVModel(props, 'replyTo', emits)
const chapterId = computed(() => props.chapterId)

const comments = ref([] as DetailedCommentResponse[])
const page = ref(1)
const total = ref(0)
const limit = 8

const pageAmount = computed(() => Math.ceil(total.value / limit))
const offset = computed(() => (page.value - 1) * limit)

function refresh() {
  replyTo.value = null
  if (page.value === 1 && chapterId.value)
    getComments()
  else
    page.value = 1
}

function setReply(reply: DetailedCommentResponse) {
  replyTo.value = reply
  const scroll = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })

  nextTick(scroll)
}

async function getComments() {
  const response = await Chapter.getComments(chapterId.value, limit, offset.value)

  if (response.data !== null) {
    comments.value = response.data.results
    total.value = response.data.total
  }
  else {
    notifications.create('error', t('getComments'), response.error)
  }
}

watch(chapterId, refresh)

watchEffect(() => { if (chapterId.value) getComments() })

defineExpose({ refresh })
</script>

<template>
  <div v-if="comments.length === 0" class="text-body-1 text-center">
    {{ t('noComments') }}
  </div>
  <comment-box-card v-for="comment in comments" :key="comment.id" :comment="comment" @reply="setReply" @update="refresh" />
  <v-pagination v-if="pageAmount > 1" v-model="page" :length="pageAmount" />
</template>

<i18n locale="en" lang="yaml">
noComments: No comments yet.
</i18n>

<i18n locale="fr" lang="yaml">
noComments: 'Aucun commentaire pour l''instant.'
</i18n>
