<template>
  <v-container fluid class="reader">
    <v-row v-if="chapter">
      <v-col v-if="['Vertical', 'Webtoon'].includes(readerMode)" cols="12">
        <vertical-reader
          :manga="chapter.manga.id"
          :chapter="chapter.id"
          :version="chapter.version"
          :length="chapter.length"
          :webtoon="readerMode === 'Webtoon'"
          @next="goToChapter(nextChapter)"
          @previous="goToChapter(previousChapter)"
        />
      </v-col>
      <v-col v-else cols="12">
        <paged-reader
          :manga="chapter.manga.id"
          :chapter="chapter.id"
          :version="chapter.version"
          :length="chapter.length"
          :double="readerMode === 'Double'"
          @next="goToChapter(nextChapter)"
          @previous="goToChapter(previousChapter)"
        />
      </v-col>
    </v-row>
    <reader-menu
      v-if="chapter"
      :chapter="chapter"
      :chapter-items="chapterItems"
      @go-to-chapter="goToChapter"
    />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import type { DetailedChapterResponse } from '@/api/Chapter';
import Chapter from '@/api/Chapter';
import Manga from '@/api/Manga';
import PagedReader from '@/components/PagedReader.vue';
import ReaderMenu from '@/components/ReaderMenu.vue';
import VerticalReader from '@/components/VerticalReader.vue';

@Component({
  components: { ReaderMenu, VerticalReader, PagedReader },
})
export default class ChapterReader extends Vue {
  chapter: DetailedChapterResponse | null = null;

  chapters: any[] = [];

  get chapterId(): string {
    return this.$route.params.chapter;
  }

  get currentChapterIndex(): number {
    return this.chapters.findIndex((el) => el.id === this.chapterId);
  }

  get previousChapter(): string | null {
    if (this.currentChapterIndex !== -1 && this.currentChapterIndex < this.chapters.length - 1) {
      return this.chapters[this.currentChapterIndex + 1].id;
    } else {
      return null;
    }
  }

  get nextChapter(): string | null {
    if (this.currentChapterIndex > 0) {
      return this.chapters[this.currentChapterIndex - 1].id;
    } else {
      return null;
    }
  }

  get chapterItems(): any[] {
    return this.chapters.map((el) => ({
      value: el.id,
      text: this.chapterName(el),
    }));
  }

  get readerMode(): string {
    return this.chapter?.webtoon ? 'Webtoon' : this.$store.getters.getReaderMode;
  }

  async goToChapter(id: string | null): Promise<void> {
    if (id) {
      await this.$router.push(`/chapters/${id}`);
      await this.getChapter();
    }
  }

  chapterName(chapter: any): string {
    const volume = chapter.volume ? `Vol ${chapter.volume} ` : '';
    const name = chapter.name ? ` - ${chapter.name}` : '';
    return volume + `Ch ${chapter.number}` + name;
  }

  async getChapter(): Promise<void> {
    const response = await Chapter.get(this.chapterId);

    if (response.data) {
      this.chapter = response.data;
      this.chapters = [{ value: this.chapterId, text: this.chapterName(response.data) }];
      await this.getChapters(response.data.mangaId);
    } else {
      const notification = {
        context: this.$t('getChapter'),
        message: response.error ?? '',
        color: 'error',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
  }

  async getChapters(mangaId: string): Promise<void> {
    const response = await Manga.chapters(mangaId);

    if (response.data) {
      this.chapters = response.data;
    } else {
      const notification = {
        context: this.$t('getChapters'),
        message: response.error ?? '',
        color: 'error',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
  }

  mounted(): void {
    this.getChapter();
  }
}
</script>

<i18n locale="en" lang="yaml">
getChapter: 'Get chapter'
getChapters: 'Get manga chapters'
</i18n>

<i18n locale="fr" lang="yaml">
getChapter: 'Chargement du chapitre'
getChapters: 'Chargement des chapitres du manga'
</i18n>
