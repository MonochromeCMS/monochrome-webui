<script setup lang="ts">
import { VForm } from 'vuetify/components'
import type Fields from './Fields.vue'
import type { MangaResponse, MangaSchema } from '@/api/Manga'

const props = defineProps<{
  manga?: MangaResponse
}>()

const router = useRouter()
const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()

const form = ref<VForm>()
const fields = ref<InstanceType<typeof Fields>>()

const valid = ref(false)

async function submit() {
  await form.value?.validate()

  if (valid.value && fields.value) {
    if (props.manga)
      await editManga(props.manga.id, fields.value.params, fields.value.cover)
    else
      await createManga(fields.value.params, fields.value.cover)
  }
}

async function createManga(params: MangaSchema, cover?: File) {
  const response = await Manga.create(params, auth.config)

  if (response.data !== null) {
    if (cover)
      await setCover(response.data.id, cover)
    router.push(`/manga/${response.data.id}`)
  }
  else {
    notifications.create('error', t('createManga'), response.error)
  }
}

async function editManga(mangaId: string, params: MangaSchema, cover?: File) {
  const response = await Manga.edit(mangaId, params, auth.config)

  if (response.data !== null) {
    if (cover)
      await setCover(mangaId, cover)
    router.push(`/manga/${mangaId}`)
  }
  else {
    notifications.create('error', t('editManga'), response.error)
  }
}

async function setCover(mangaId: string, cover: File) {
  const response = await Manga.setCover(mangaId, cover, auth.config)

  if (response.data === null)
    notifications.create('error', t('setCover'), response.error)
}
</script>

<template>
  <VForm ref="form" v-model="valid" @submit.prevent="submit">
    <manga-form-fields ref="fields" :manga="manga" />
  </VForm>
</template>

<i18n locale="en" lang="yaml">
editManga: Edit manga
createManga: Create manga
setCover: Set cover
</i18n>

<i18n locale="fr" lang="yaml">
editManga: Modifier manga
createManga: Créer manga
setCover: Définir couverture
</i18n>
