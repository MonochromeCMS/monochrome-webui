<script setup lang="ts">
import {
  mdiArrowExpandHorizontal,
  mdiArrowExpandVertical,
  mdiArrowLeft,
  mdiArrowRight,
  mdiClose,
} from '@mdi/js'
import type { ChapterResponse, DetailedChapterResponse } from '@/api/Chapter'
import type { ReaderMode } from '@/store/reader'

const props = defineProps<{
  chapter: DetailedChapterResponse
  chapters: ChapterResponse[]
}>()

const emits = defineEmits<{
  (event: 'close'): void
}>()

const { t } = useI18n()
const reader = useReader()

const chapterId = useRouteSingleParam('chapterId')

const fit = computed({
  get() {
    switch (reader.fit) {
      case 'width':
        return 0
      case 'height':
        return 2
      default:
        return 1
    }
  },
  set(value: number) {
    switch (value) {
      case 0:
        reader.fit = 'width'
        break
      case 2:
        reader.fit = 'height'
        break
      default:
        reader.fit = 'auto'
    }
  },
})

const width = computed({
  get() {
    return Number(reader.width.slice(0, -1))
  },
  set(value: number) {
    reader.width = `${value}%`
  },
})

const readerMode = computed({
  get() {
    return props.chapter.webtoon ? 'webtoon' : reader.readerMode
  },
  set(v: ReaderMode) {
    if (!props.chapter.webtoon)
      reader.readerMode = v
  },
})

const modeItems = computed(() => props.chapter.webtoon ? [{ title: t('webtoon'), value: 'webtoon' }] : [{ title: t('single'), value: 'single' }, { title: t('double'), value: 'double' }, { title: t('vertical'), value: 'vertical' }])

function chapterName(chapter: ChapterResponse) {
  const volume = chapter.volume ? `Vol ${chapter.volume} ` : ''
  const name = chapter.name ? ` - ${chapter.name}` : ''
  return `${volume}Ch ${chapter.number}${name}`
}

const chapterItems = computed(() => props.chapters.map(chapter => ({
  title: chapterName(chapter),
  value: chapter.id,
})))
</script>

<template>
  <v-card>
    <v-card-title class="text-center d-flex mt-2 align-center">
      <router-link class="text-decoration-none text-primary d-block w-100" :to="`/manga/${chapter.mangaId}`">
        {{ chapter.manga.title }}
      </router-link>
      <v-btn icon size="default" variant="text" @click="emits('close')">
        <v-icon :icon="mdiClose" />
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-select v-model="chapterId" :label="t('chapter')" :items="chapterItems" variant="outlined" />
      <v-divider />
      <div class="text-h6 my-3">
        {{ t('readerSettings') }}
      </div>
      <v-select v-model="readerMode" :label="t('readerMode')" :items="modeItems" variant="outlined" />
      <!-- Width setting -->
      <template v-if="readerMode === 'webtoon'">
        <div class="text-caption mt-3">
          {{ t('width') }}
        </div>
        <v-slider
          v-model="width"
          step="5"
          min="5"
          max="100"
          thumb-color="primary"
          thumb-label
        >
          <template #thumb-label>
            {{ width }}%
          </template>
        </v-slider>
      </template>
      <!-- Fit setting -->
      <v-row v-if="readerMode !== 'webtoon'" align="center" class="my-0">
        <v-col class="text-body-1">
          {{ t('imageFit') }}
        </v-col>
        <v-col class="text-right pa-2">
          <v-btn-toggle v-model="fit" divided mandatory>
            <v-btn color="primary">
              <v-icon>{{ mdiArrowExpandHorizontal }}</v-icon>
            </v-btn>
            <v-btn color="primary">
              {{ t("default") }}
            </v-btn>
            <v-btn color="primary">
              <v-icon>{{ mdiArrowExpandVertical }}</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <!-- Direction setting -->
      <v-row v-if="['single', 'double'].includes(readerMode)" align="center" class="my-0">
        <v-col class="text-body-1">
          {{ t("pageDirection") }}
        </v-col>
        <v-col class="text-right pa-2">
          <v-btn-toggle v-model="reader.direction" mandatory>
            <v-btn color="primary">
              <v-icon>{{ mdiArrowLeft }}</v-icon>
            </v-btn>
            <v-btn color="primary">
              <v-icon>{{ mdiArrowRight }}</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <!-- Double parity setting -->
      <v-row v-if="readerMode === 'double'" align="center" class="my-0">
        <v-col class="text-body-1">
          {{ t("doublePageParity") }}
        </v-col>
        <v-col class="text-right pa-2">
          <v-btn-toggle v-model="reader.parity" mandatory>
            <v-btn color="primary">
              {{ t("even") }}
            </v-btn>
            <v-btn color="primary">
              {{ t("odd") }}
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<i18n locale="en" lang="yaml">
chapter: Chapter
readerSettings: Reader settings
readerMode: Reader mode
width: Width
imageFit: Image fit
pageDirection: Page direction
doublePageParity: Double page parity
default: Default
even: Even
odd: Odd
webtoon: Webtoon reader
single: Single page
double: Double page
vertical: Vertical reader
</i18n>

<i18n locale="fr" lang="yaml">
chapter: Chapitre
readerSettings: Paramètres du lecteur
readerMode: Mode de lecture
width: Largeur
imageFit: 'Ajustement de l''image'
pageDirection: Direction de lecture
doublePageParity: Parité des pages
default: Défaut
even: Paire
odd: Impaire
webtoon: Lecteur webtoon
single: Page simple
double: Page double
vertical: Lecteur vertical
</i18n>
