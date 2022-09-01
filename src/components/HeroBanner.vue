<template>
  <div>
    <v-skeleton-loader v-if="loading" type="image" class="image-skeleton" :height="height" />
    <v-carousel
      v-else
      v-model="model"
      cycle
      :show-arrows="false"
      class="rounded-lg"
      :height="height"
    >
      <v-carousel-item v-for="manga in mangaList" :key="manga.id" :to="`/manga/${manga.id}`">
        <v-parallax
          :height="height"
          :src="getMangaImage(manga.id, manga.version)"
          class="parallax-gradient"
        >
          <v-row class="fill-height px-3 row-column">
            <div class="text-h2">{{ manga.title }}</div>
            <div class="text-subtitle-1 pt-2">{{ manga.description }}</div>
          </v-row>
        </v-parallax>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

import type { MangaResponse } from "@/api/Manga"
import Manga from "@/api/Manga"
import Media from "@/api/Media"

@Component
export default class HeroBanner extends Vue {
  model = null

  loading = true

  height = 400

  mangaList: MangaResponse[] = []

  getMangaImage(id: string, version: number) {
    return Media.cover(id, version)
  }

  async getManga() {
    const response = await Manga.search(null, 3, 0, this.loading)

    if (response.data != null) {
      this.mangaList = response.data.results
    } else {
      const notification = {
        color: "error",
        context: this.$tc("latestManga"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }

    this.loading = false
  }

  mounted() {
    this.getManga()
  }
}
</script>

<style lang="scss">
.parallax-gradient {
  position: relative;
  padding-bottom: 5rem;

  &::before {
    content: "";
    position: absolute;
    background: linear-gradient(to right, black, rgba(0, 0, 0, 0.3));
    height: 100%;
    width: 100%;
    z-index: 2;
  }
}

.row-column {
  flex-direction: column;
  justify-content: flex-end;
}

.image-skeleton .v-skeleton-loader__image {
  height: 100%;
}
</style>

<i18n locale="en" lang="yaml">
latestManga: "Latest manga"
</i18n>

<i18n locale="fr" lang="yaml">
latestManga: "Derniers mangas ajoutés"
</i18n>
