<template>
  <v-card color="background" :to="to(manga)" height="100%" class="d-flex flex-column">
    <v-img aspect-ratio="1" :src="cover(manga)" />
    <v-card-title v-text="manga.title" />
    <v-card-subtitle v-text="manga.author" />
    <v-card-text class="card-description" v-text="manga.description" />
    <v-divider />
    <v-chip
      class="status-chip"
      :color="statusColor[manga.status] || 'gray'"
      v-text="$t(`status.${manga.status}`)"
    />
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"

import type { MangaResponse } from "@/api/Manga"
import Media from "@/api/Media"

@Component
export default class MangaCard extends Vue {
  @Prop() readonly manga!: MangaResponse

  statusColor = {
    cancelled: "red",
    completed: "green darken-2",
    hiatus: "orange",
    ongoing: "green",
  }

  cover(manga: MangaResponse): string {
    return Media.cover(manga.id, manga.version)
  }

  to(manga: MangaResponse): string {
    return `/manga/${manga.id}`
  }
}
</script>

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
