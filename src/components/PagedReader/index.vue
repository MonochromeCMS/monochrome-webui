<script setup lang="ts">
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import type { ChapterResponse } from '@/api/Chapter'

const props = defineProps<{
  chapter: ChapterResponse
  double: boolean
  nextChapter: string | null
  previousChapter: string | null
}>()
const emits = defineEmits<{
  (e: 'lastPage'): void
}>()

const chapter = computed(() => props.chapter)
const length = computed(() => chapter.value.length)
const double = computed(() => props.double)

const reader = useReader()
const direction = computed(() => reader.direction)
const parity = computed(() => reader.parity)

const amountTabs = computed(() => props.double ? Math.ceil((length.value + parity.value) / 2) : length.value)

const currentPage = ref(direction.value ? 1 : amountTabs.value)

const pageGen = (max: number, index: number) => {
  if (index < 0 || index >= max)
    return null
  return Media.page(chapter.value.mangaId, chapter.value.id, index + 1, chapter.value.version)
}
const urls = computed(() => {
  const result: (string | null)[][] = []

  for (let i = 0; i < amountTabs.value; i++) {
    if (double.value) {
      const firstPage = pageGen(length.value, i * 2 - parity.value)
      const secondPage = pageGen(length.value, i * 2 + 1 - parity.value)
      result.push(direction.value ? [firstPage, secondPage] : [secondPage, firstPage])
    }
    else {
      result.push([pageGen(length.value, i), null])
    }
  }
  return direction.value ? result : result.reverse()
})

const readerRef = ref<HTMLDivElement>()
function handleArrows(ev: KeyboardEvent) {
  if (currentPage.value === null)
    return

  switch (ev.code) {
    case 'KeyA':
    case 'ArrowLeft':
      currentPage.value -= 1
      break
    case 'KeyD':
    case 'ArrowRight':
      currentPage.value += 1
  }
}
useEventListener(readerRef, 'keyup', handleArrows)

watch(chapter, () => {
  currentPage.value = direction.value ? 1 : amountTabs.value
})

watch(direction, () => {
  if (currentPage.value === null)
    return

  currentPage.value = amountTabs.value - currentPage.value + 1
})

watch(parity, (newParity) => {
  if (currentPage.value === null)
    return

  switch (true) {
    case props.double && newParity && length.value % 2 === 0:
      currentPage.value -= direction.value
      break
    case props.double && length.value % 2 === 0:
      currentPage.value += direction.value
  }
})

watch(currentPage, (newPage) => {
  if (newPage === null)
    return

  switch (true) {
    case newPage === amountTabs.value && !!direction.value:
    case newPage === 1 && !direction.value:
      emits('lastPage')
      break
  }
})

watch(double, (newDouble) => {
  if (currentPage.value === null)
    return

  if (newDouble)
    currentPage.value = Math.ceil((currentPage.value - parity.value) / 2)
  else
    currentPage.value = 2 * currentPage.value - 1
})

useImageLoader(urls, computed(() => currentPage.value - 1))
</script>

<template>
  <div id="reader" ref="readerRef">
    <paged-reader-tabs
      v-model="currentPage"
      :amount="amountTabs"
      :direction="direction"
    />
    <v-carousel v-model="currentPage" height="auto" hide-delimiters>
      <template #prev="{ attrs }">
        <button v-bind="attrs" class="reader-buttons" @click="currentPage -= 1">
          <v-icon size="3rem" :icon="mdiChevronLeft" />
        </button>
      </template>
      <template #next="{ attrs }">
        <button v-bind="attrs" class="reader-buttons" @click="currentPage += 1">
          <v-icon size="3rem" :icon="mdiChevronRight" />
        </button>
      </template>
      <v-carousel-item>
        <paged-reader-delimiter :next="nextChapter" :prev="previousChapter" :position="direction ? 'prev' : 'next'" />
      </v-carousel-item>

      <v-carousel-item v-for="index in amountTabs" :key="index" class="d-flex">
        <paged-reader-slide :pages="urls[index - 1]" />
      </v-carousel-item>

      <v-carousel-item>
        <paged-reader-delimiter :next="nextChapter" :prev="previousChapter" :position="!direction ? 'prev' : 'next'" />
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<style lang="scss">
  #reader {
    .v-window__controls {
      padding: 0
    }

    .v-window__prev,
    .v-window__next {
      height: 100%;
      top: 0;
      border-radius: 0;
      margin: 0;
      background: none;
    }

    .reader-buttons {
      height: 100%;
      padding: 16px;

      transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s;

      .v-icon {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        opacity: 0.6;
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.2);

        .v-icon {
          background-color: transparent;
          opacity: 1;
        }
      }
    }
  }
  </style>
