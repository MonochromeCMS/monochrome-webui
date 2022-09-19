<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import { VForm } from 'vuetify/components'
import type Fields from './Fields.vue'
import type { UploadSessionResponse } from '@/api/Upload'
import type { ChapterResponse, ChapterSchema } from '@/api/Chapter'

const props = defineProps<{
  chapter?: ChapterResponse
  mangaId: string
}>()

const router = useRouter()
const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()

const form = ref<VForm>()
const fields = ref<InstanceType<typeof Fields>>()

const valid = ref(false)
const loading = ref(false)
const sessionQuery = useRouteQuery('id')
const session = ref(null as UploadSessionResponse | null)

async function submit() {
  await form.value?.validate()

  loading.value = true
  if (valid.value && fields.value) {
    switch (true) {
      case props.chapter?.id && !session.value:
        await editChapter(fields.value.chapterDraft)
        break
      case !!(session.value):
        await commitSession(fields.value.chapterDraft, fields.value.pageOrder)
    }
  }
  loading.value = false
}

async function createSession() {
  const response = await Upload.begin(props.mangaId, props.chapter?.id, auth.config)

  if (response.data !== null) {
    sessionQuery.value = response.data.id
    session.value = response.data
  }
  else {
    notifications.create('error', t('getSession'), response.error)
  }
}

async function getSession(sessionId: string | string[]) {
  if (typeof sessionId !== 'string') {
    sessionQuery.value = ''
    return
  }

  const response = await Upload.get(sessionId, auth.config)

  if (response.data !== null) {
    if (props.mangaId !== response.data.mangaId) {
      notifications.create('error', t('getSession'), t('mangaSessionError'))
      sessionQuery.value = null
    }
    else if (props.chapter && (props.chapter.id !== response.data.chapterId)) {
      notifications.create('error', t('getSession'), t('chapterSessionError'))
      sessionQuery.value = null
    }
    session.value = response.data
  }
  else {
    notifications.create('error', t('getSession'), response.error)
    sessionQuery.value = null
  }
}

async function editChapter(chapterDraft: ChapterSchema) {
  if (!props.chapter)
    return

  const response = await Chapter.edit(props.chapter.id, chapterDraft, auth.config)

  if (response.data !== null)
    router.push(`/manga/${props.mangaId}/${response.data.id}`)
  else
    notifications.create('error', t('editChapter'), response.error)
}

async function commitSession(chapterDraft: ChapterSchema, pageOrder: string[]) {
  if (!session.value)
    return

  const response = await Upload.commit(session.value.id, chapterDraft, pageOrder, auth.config)

  if (response.data !== null)
    router.push(`/chapters/${response.data.id}`)
  else
    notifications.create('error', t('commitSession'), response.error)
}

watchEffect(() => {
  if (sessionQuery.value) {
    if (sessionQuery.value !== session.value?.id)
      getSession(sessionQuery.value)
  }
  else if (!props.chapter) {
    createSession()
  }
})
</script>

<template>
  <VForm ref="form" v-model="valid" :readonly="loading" @submit.prevent="submit">
    <upload-form-fields
      ref="fields"
      :disabled="loading"
      :manga-id="mangaId"
      :chapter="chapter"
      :session="session"
      @session="createSession()"
    />
  </VForm>
</template>

<i18n locale="en" lang="yaml">
uploadChapter: Upload chapter
createSession: Create upload session
getSession: Get upload session
editChapter: Edit chapter
commitSession: Commit upload session
mangaSessionError: 'The session''s manga isn''t the expected one'
chapterSessionError: 'The session''s chapter isn''t the expected one'
</i18n>

<i18n locale="fr" lang="yaml">
uploadChapter: Ajouter un chapitre
createSession: Création de session
getSession: Demande de session
editChapter: Modifier le chapitre
commitSession: Confirmation de session
mangaSessionError: 'Le manga de la session n''est pas celui attendu'
chapterSessionError: 'Le chapitre de la session n''est pas celui attendu'
</i18n>
