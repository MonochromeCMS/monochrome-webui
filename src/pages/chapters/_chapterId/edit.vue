<script setup lang="ts">
import type { ApiResponseFail } from '@/api/Base'
import type { DetailedChapterResponse } from '@/api/Chapter'
import type { MangaResponse } from '@/api/Manga'

const router = useRouter()
const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()
const error = ref(null as ApiResponseFail | null)

const chapterId = useRouteSingleParam('chapterId')

const chapter = ref(null as DetailedChapterResponse | null)
const manga = ref(null as MangaResponse | null)

const cover = computed(() => manga.value ? Media.cover(manga.value.id, manga.value.version) : '')

async function getChapter() {
  const response = await Chapter.get(chapterId.value)

  if (response.data !== null) {
    chapter.value = response.data
    await getManga(response.data.mangaId)
  }
  else {
    error.value = response
  }
}

async function getManga(mangaId: string) {
  const response = await Manga.get(mangaId)

  if (response.data !== null)
    manga.value = response.data
  else
    error.value = response
}

watch(chapter, (chapter) => {
  if (chapter && !Chapter.canEdit(chapter, auth.id, auth.role)) {
    notifications.create('error', t('editChapter'), t('noEditPermission'))
    router.replace('/')
  }
})

watchEffect(() => {
  if (chapterId.value)
    getChapter()
})
</script>

<template>
  <error-container v-if="error" :error="error" />
  <v-container v-else class="fill-height">
    <v-row class="h-100">
      <v-col cols="12" lg="10" class="ma-auto">
        <v-card color="backgroundAlt" flat>
          <v-card-title class="text-center lemon-milk">
            {{ t('editChapter') }}
          </v-card-title>
          <manga-row v-if="manga" :manga="manga" :cover="cover" class="background rounded mx-4" />
          <v-card-text>
            <upload-form v-if="chapter && manga" :manga-id="manga.id" :chapter="chapter" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<i18n locale="en" lang="yaml">
getChapter: Get chapter
editChapter: Edit chapter
noEditPermission: 'You aren''t allowed to edit this chapter'
</i18n>

<i18n locale="fr" lang="yaml">
getChapter: Chargement du chapitre
editChapter: Modification du chapitre
noEditPermission: 'Vous n''êtes pas autorisé à modifier ce chapitre'
</i18n>

<route lang="yaml">
meta:
  needsAuth: true
</route>
