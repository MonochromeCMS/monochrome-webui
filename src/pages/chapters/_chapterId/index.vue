<script setup lang="ts">
import type { ApiResponseFail } from '@/api/Base'
import type { ChapterResponse, DetailedChapterResponse } from '@/api/Chapter'
import type { ProgressTrackingSchema } from '@/api/Progress'

const { t } = useI18n()
const auth = useAuth()
const reader = useReader()
const notifications = useNotifications()
const error = ref(null as ApiResponseFail | null)

const chapter = ref(null as DetailedChapterResponse | null)
const chapters = ref([] as ChapterResponse[])

const chapterId = useRouteSingleParam('chapterId')

const chapterIndex = computed(() => chapters.value.findIndex(c => c.id === chapterId.value))
const nextChapter = computed(() => chapters.value[chapterIndex.value - 1]?.id)
const previousChapter = computed(() => chapterIndex.value !== -1 ? chapters.value[chapterIndex.value + 1]?.id : null)
const readerMode = computed(() => chapter.value?.webtoon ? 'webtoon' : reader.readerMode)

async function getChapter() {
  const response = await Chapter.get(chapterId.value)

  if (response.data !== null) {
    chapter.value = response.data
    chapters.value = [response.data]
    await getChapters(response.data.mangaId)
  }
  else {
    error.value = response
  }
}

async function getChapters(mangaId: string) {
  const response = await Manga.chapters(mangaId, auth.config)

  if (response.data !== null)
    chapters.value = response.data
  else
    notifications.create('error', t('getChapters'), response.error)
}

async function markChapterRead() {
  if (chapter.value === null || !auth.isConnected)
    return

  const tracking: ProgressTrackingSchema = {
    chapterId: chapter.value.id,
    page: chapter.value.length,
    chapterVersion: chapter.value.version,
    read: true,
  }

  const response = await Progress.pushTracking(tracking, auth.config)

  if (response.data === null)
    notifications.create('error', t('markChapterRead'), response.error)
}

watchEffect(() => {
  if (chapterId.value)
    getChapter()
})
</script>

<template>
  <error-container v-if="error" :error="error" />
  <v-container v-else fluid class="reader">
    <v-row>
      <v-col v-if="['vertical', 'webtoon'].includes(readerMode)" cols="12">
        <vertical-reader
          v-if="chapter"
          :chapter="chapter"
          :webtoon="readerMode === 'webtoon'"
          :next-chapter="nextChapter"
          :previous-chapter="previousChapter"
          @last-page="markChapterRead"
        />
      </v-col>
      <v-col v-else cols="12">
        <paged-reader
          v-if="chapter"
          :chapter="chapter"
          :double="readerMode === 'double'"
          :next-chapter="nextChapter"
          :previous-chapter="previousChapter"
          @last-page="markChapterRead"
        />
      </v-col>
    </v-row>
    <comment-box :chapter-id="chapterId.value" />
    <reader-menu v-if="chapter" :chapter="chapter" :chapters="chapters" />
  </v-container>
</template>

<i18n locale="en" lang="yaml">
getChapters: Get manga chapters
</i18n>

<i18n locale="fr" lang="yaml">
getChapters: Chargement des chapitres du manga
</i18n>

<route lang="yaml">
meta:
  hideInterface: true
</route>
