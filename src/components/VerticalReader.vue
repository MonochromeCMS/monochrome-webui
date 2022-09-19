<script setup lang="ts">
import type { ChapterResponse } from '@/api/Chapter'

const props = defineProps<{
  chapter: ChapterResponse
  webtoon: boolean
  nextChapter: string | null
  previousChapter: string | null
}>()

const emits = defineEmits<{
  (e: 'lastPage'): void
}>()

const { t } = useI18n()
const reader = useReader()
const chapterId = useRouteSingleParam('chapterId')

const currentPage = ref(1)
const fit = computed(() => props.webtoon ? 'mx-auto' : reader.fit)
const width = computed(() => props.webtoon ? reader.width : undefined)

function page(index: number) {
  return Media.page(props.chapter.mangaId, props.chapter.id, index, props.chapter.version)
}

function goToChapter(newChapter: string) {
  chapterId.value = newChapter
}

function pageVisible(index: number) {
  currentPage.value = index

  if (index === props.chapter.length)
    emits('lastPage')
}

const urls = computed(() => Array.from({ length: props.chapter.length }, (_, i) => [page(i + 1)]))

useImageLoader(urls, computed(() => currentPage.value - 1))
</script>

<template>
  <v-row class="ma-0">
    <v-col v-if="previousChapter" cols="12" class="pa-0">
      <v-btn block variant="text" :width="width" :class="fit" @click="goToChapter(previousChapter || '')">
        {{ t('previousChapter') }}
      </v-btn>
    </v-col>
    <v-col
      v-for="index in chapter.length"
      :key="page(index)"
      cols="12"
      class="pa-0"
    >
      <image-preload :class="fit" :width="width" :src="page(index)" @visible="pageVisible(index)" />
    </v-col>
    <v-col v-if="nextChapter" cols="12" class="pa-0">
      <v-btn block variant="text" :width="width" :class="fit" @click="goToChapter(nextChapter || '')">
        {{ t('nextChapter') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<style lang="scss">
.webtoon {
  padding: 0;
}
.default {
  margin: auto;
  max-height: 150vh;
  max-width: 100%;
}
.width {
  width: 100%;
}
.height {
  height: calc(100vh - 5rem);
  margin: auto;
  max-width: 100%;
}
</style>

<i18n locale="en" lang="yaml">
previousChapter: Previous chapter
nextChapter: Next chapter
</i18n>

<i18n locale="fr" lang="yaml">
previousChapter: Chapitre précédant
nextChapter: Chapitre suivant
</i18n>
