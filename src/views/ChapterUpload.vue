<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="10" class="mx-auto">
        <v-card rounded="lg" color="backgroundAlt" elevation="0" class="pa-4">
          <v-card-title class="justify-center lemon-milk">{{ $t("uploadChapter") }}</v-card-title>
          <manga-row :loading="!manga" :manga="manga" :cover="cover" class="background rounded" />
          <v-card-text>
            <upload-form v-if="manga" :chapter="null" :manga-id="mangaId" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

import Chapter from "@/api/Chapter"
import type { MangaResponse } from "@/api/Manga"
import Manga from "@/api/Manga"
import Media from "@/api/Media"
import type { Role } from "@/api/User"

@Component
export default class ChapterUpload extends Vue {
  manga: MangaResponse | null = null

  get mangaId(): string {
    return this.$route.params.manga
  }

  get cover(): string {
    if (this.manga) {
      return Media.cover(this.manga.id, this.manga.version)
    } else {
      return ""
    }
  }

  get isConnected(): boolean {
    return this.$store.getters.isConnected
  }

  get userRole(): Role {
    return this.$store.getters.userRole
  }

  async getManga(): Promise<void> {
    const response = await Manga.get(this.mangaId)

    if (response.data) {
      this.manga = response.data
    } else {
      const notification = {
        color: "error",
        context: this.$t("getChapter"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }
  }

  mounted(): void {
    if (!this.isConnected || !Chapter.canCreate(this.userRole)) {
      this.$router.replace("/")
    } else {
      this.getManga()
    }
  }
}
</script>

<i18n locale="en" lang="yaml">
getChapter: "Get chapter"
uploadChapter: "Upload chapter"
</i18n>

<i18n locale="fr" lang="yaml">
getChapter: "Chargement du chapitre"
uploadChapter: "Ajout du chapitre"
</i18n>
