<script setup lang="ts">
import type { ChapterResponse } from '@/api/Chapter'

const props = defineProps<{
  mangaId: string
  firstChapter: string
}>()

const firstChapter = useVModel(props, 'firstChapter')

const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()

const chapters = ref([] as ChapterResponse[])
const page = ref(1)
const limit = 10

const pageAmount = computed(() => Math.ceil(chapters.value.length / limit))
const chaptersPage = computed(() => {
  const start = limit * (page.value - 1)
  return chapters.value.slice(start, start + limit)
})

function canEdit(chapter: ChapterResponse) {
  if (!auth.isConnected)
    return false
  return Chapter.canEdit(chapter, auth.id, auth.role)
}

async function getChapters() {
  const response = await Manga.chapters(props.mangaId, auth.config)

  if (response.data !== null)
    chapters.value = response.data
  else
    notifications.create('error', t('mangaChapters'), response.error)
}

watch(chapters, () => {
  if (chapters.value.length)
    firstChapter.value = chapters.value[chapters.value.length - 1].id
})

watchEffect(() => {
  if (props.mangaId)
    getChapters()
})
</script>

<template>
  <v-row class="flex-column align-center ma-0 pa-4">
    <v-col cols="12" class="text-h6 text-lg-h5 text-xl-h3 text-center pt-0" tag="h2">
      {{ t('chapters') }}
    </v-col>
    <manga-chapters-row v-for="item in chaptersPage" :key="item.id" :chapter="item" :show-edit="canEdit" @update="getChapters" />
    <v-col v-if="chapters.length === 0" cols="12" class="text-body-1 text-center">
      {{ t("noChapters") }}
    </v-col>
    <v-col v-if="pageAmount > 1" cols="12">
      <v-pagination
        v-model="page"
        class="mx-auto"
        :length="pageAmount"
      />
    </v-col>
  </v-row>
</template>

<i18n locale="en" lang="yaml">
chapters: Chapters
mangaChapters: Manga chapters
</i18n>

<i18n locale="fr" lang="yaml">
chapters: Chapitres
mangaChapters: Chapitres du manga
</i18n>
