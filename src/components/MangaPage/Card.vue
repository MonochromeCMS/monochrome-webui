<script setup lang="ts">
import { Media } from '@/api/Media'
import type { MangaResponse } from '@/api/Manga'

defineProps<{
  manga: MangaResponse
}>()

const { t } = useI18n()

const statusColor = {
  cancelled: 'red',
  completed: 'green-darken-2',
  hiatus: 'orange',
  ongoing: 'green',
}
</script>

<template>
  <v-card
    color="background"
    :to="`/manga/${manga.id}`"
    height="100%"
    class="d-flex flex-column"
  >
    <v-img cover aspect-ratio="1" :src="Media.cover(manga.id, manga.version)" />
    <v-card-title>{{ manga.title }}</v-card-title>
    <v-card-subtitle>{{ manga.author }}</v-card-subtitle>
    <v-card-text class="card-description">
      {{ manga.description }}
    </v-card-text>
    <v-divider />
    <v-chip class="status-chip" variant="flat" :color="statusColor[manga.status] || 'gray'">
      {{ t(`status.${manga.status}`) }}
    </v-chip>
  </v-card>
</template>

<style lang="scss">
  .status-chip {
    margin: 0.5rem 0.5rem 0.5rem auto;
  }

  .card-description {
    overflow: hidden;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    padding-bottom: 0 !important;
    margin-bottom: 1rem;
  }
  </style>
