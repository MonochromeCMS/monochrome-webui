<script setup lang="ts">
import type { ApiResponseFail } from '@/api/Base'
import type { MangaResponse } from '@/api/Manga'

const router = useRouter()
const { t } = useI18n()
const auth = useAuth()
const error = ref(null as ApiResponseFail | null)

const mangaId = useRouteSingleParam('mangaId')
const manga = ref(null as MangaResponse | null)
const cover = computed(() => manga.value ? Media.cover(manga.value.id, manga.value.version) : '')

async function getManga() {
  const response = await Manga.get(mangaId.value)

  if (response.data !== null)
    manga.value = response.data
  else
    error.value = response
}

watchEffect(getManga)

watchEffect(() => {
  if (!Chapter.canCreate(auth.role))
    router.replace('/')
})
</script>

<template>
  <error-container v-if="error" :error="error" />
  <v-container class="fill-height">
    <v-row class="h-100">
      <v-col cols="12" lg="10" class="ma-auto">
        <v-card color="backgroundAlt" flat>
          <v-card-title class="text-center lemon-milk">
            {{ t('uploadChapter') }}
          </v-card-title>
          <manga-row :manga="manga" :cover="cover" class="bg-background rounded mx-4" />
          <v-card-text>
            <upload-form v-if="manga" :manga-id="mangaId" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<i18n locale="en" lang="yaml">
getChapter: Get chapter
uploadChapter: Upload chapter
</i18n>

<i18n locale="fr" lang="yaml">
getChapter: Chargement du chapitre
uploadChapter: Ajout du chapitre
</i18n>

<route lang="yaml">
meta:
  needsAuth: true
</route>
