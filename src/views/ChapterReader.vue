<template>
  <v-container fluid class="reader">
    <v-row v-if="chapter">
      <v-col v-if="['Vertical', 'Webtoon'].includes(readerMode)" cols="12">
        <vertical-reader
          :manga-id="chapter.manga.id"
          :chapter-id="chapter.id"
          :version="chapter.version"
          :length="chapter.length"
          :webtoon="readerMode === 'Webtoon'"
          @next="goToChapter(nextChapter)"
          @previous="goToChapter(previousChapter)"
        />
      </v-col>
      <v-col v-else cols="12">
        <paged-reader
          :manga-id="chapter.manga.id"
          :chapter-id="chapter.id"
          :version="chapter.version"
          :length="chapter.length"
          :double="readerMode === 'Double'"
          @next="goToChapter(nextChapter)"
          @previous="goToChapter(previousChapter)"
        />
      </v-col>
    </v-row>
    <comment-box :chapter-id="chapterId" />
    <reader-menu
      v-if="chapter"
      :chapter="chapter"
      :chapter-items="chapterItems"
      @go-to-chapter="goToChapter"
    />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator"

import type { ChapterResponse, DetailedChapterResponse } from "@/api/Chapter"
import Chapter from "@/api/Chapter"
import Manga from "@/api/Manga"

export interface ChapterItem {
  text: string
  value: string
}

@Component
export default class ChapterReader extends Vue {
  chapter: DetailedChapterResponse | null = null

  chapters: ChapterResponse[] = []

  get chapterId(): string {
    return this.$route.params.chapter
  }

  @Watch("chapterId", { immediate: true })
  onChapterChange() {
    this.getChapter()
  }

  get currentChapterIndex(): number {
    return this.chapters.findIndex((el) => el.id === this.chapterId)
  }

  get previousChapter(): string | null {
    if (this.currentChapterIndex !== -1 && this.currentChapterIndex < this.chapters.length - 1) {
      return this.chapters[this.currentChapterIndex + 1].id
    } else {
      return null
    }
  }

  get nextChapter(): string | null {
    if (this.currentChapterIndex > 0) {
      return this.chapters[this.currentChapterIndex - 1].id
    } else {
      return null
    }
  }

  get chapterItems(): ChapterItem[] {
    return this.chapters.map((el) => ({
      text: this.chapterName(el),
      value: el.id,
    }))
  }

  get readerMode(): string {
    return this.chapter?.webtoon ? "Webtoon" : this.$store.getters.getReaderMode
  }

  async goToChapter(id: string | null): Promise<void> {
    if (id) {
      await this.$router.push(`/chapters/${id}`)
    }
  }

  chapterName(chapter: ChapterResponse): string {
    const volume = chapter.volume ? `Vol ${chapter.volume} ` : ""
    const name = chapter.name ? ` - ${chapter.name}` : ""
    return volume + `Ch ${chapter.number}` + name
  }

  async getChapter(): Promise<void> {
    const response = await Chapter.get(this.chapterId)

    if (response.data) {
      this.chapter = response.data
      this.chapters = [this.chapter]
      await this.getChapters(response.data.mangaId)
    } else {
      const notification = {
        color: "error",
        context: this.$t("getChapter"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }
  }

  async getChapters(mangaId: string): Promise<void> {
    const response = await Manga.chapters(mangaId)

    if (response.data) {
      this.chapters = response.data
    } else {
      const notification = {
        color: "error",
        context: this.$t("getChapters"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }
  }

  mounted(): void {
    this.getChapter()
  }
}
</script>

<i18n locale="en" lang="yaml">
getChapter: "Get chapter"
getChapters: "Get manga chapters"
</i18n>

<i18n locale="fr" lang="yaml">
getChapter: "Chargement du chapitre"
getChapters: "Chargement des chapitres du manga"
</i18n>
