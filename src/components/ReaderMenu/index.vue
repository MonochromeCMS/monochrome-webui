<script setup lang="ts">
import { mdiMenu } from '@mdi/js'
import type { ChapterResponse, DetailedChapterResponse } from '@/api/Chapter'

defineProps<{
  chapter: DetailedChapterResponse
  chapters: ChapterResponse[]
}>()

const dialog = ref(false)
</script>

<template>
  <v-btn
    color="background"
    variant="flat"
    size="large"
    icon
    aria-label="Theme toggle"
    class="reader-button"
  >
    <v-icon size="large" :icon="mdiMenu" />
    <v-dialog v-model="dialog" max-width="30rem" activator="parent">
      <reader-menu-dialog :chapter="chapter" :chapters="chapters" @close="dialog = false" />
    </v-dialog>
  </v-btn>
</template>

<style lang="scss">
.reader-button {
  position: fixed !important;
  right: 1rem;
  bottom: 1rem;
  z-index: 2;
}
</style>
