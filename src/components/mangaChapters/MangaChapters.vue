<template>
  <v-container>
    <manga-chapters-loading v-if="loading" :amount="limit" />
    <v-row v-else class="flex-column align-center">
      <v-col cols="12" class="text-h3 text-center" tag="h2">{{ $t('chapters') }}</v-col>
      <v-col
        v-for="(item, index) in chaptersPage"
        :key="item.id"
        cols="12"
        class="chapter-row pa-1"
      >
        <chapter-row :chapter="item" :show-edit="canEdit(item)" @delete="popChapter(index)" />
      </v-col>
      <v-col v-if="chapters.length === 0" cols="12" class="text-body-1 text-center">
        {{ $t('noChapters') }}
      </v-col>
      <v-col v-if="pageAmount > 1" cols="12">
        <v-pagination
          v-model="page"
          class="mx-auto"
          color="background text--primary"
          :length="pageAmount"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { mdiDotsVertical } from '@mdi/js';
import { Component, Prop, VModel, Vue, Watch } from 'vue-property-decorator';

import type { ChapterResponse } from '@/api/Chapter';
import Chapter from '@/api/Chapter';
import Manga from '@/api/Manga';
import type { Role } from '@/api/User';

import ChapterRow from './ChapterRow.vue';
import MangaChaptersLoading from './MangaChaptersLoading.vue';

@Component({
  components: { ChapterRow, MangaChaptersLoading },
})
export default class MangaChapters extends Vue {
  @Prop() readonly mangaId!: string;

  @VModel({ type: String }) firstChapter!: string;

  icons = {
    mdiDotsVertical,
  };

  chapters: ChapterResponse[] = [];

  loading = true;

  limit = 10;

  page = 1;

  get pageAmount(): number {
    return Math.ceil(this.chapters.length / this.limit);
  }

  get chaptersPage(): ChapterResponse[] {
    const start = this.limit * (this.page - 1);
    return this.chapters.slice(start, start + this.limit);
  }

  get userId(): string {
    return this.$store.getters.userId;
  }

  get userRole(): Role {
    return this.$store.getters.userRole;
  }

  canEdit(chapter: ChapterResponse): boolean {
    return Chapter.canEdit(chapter, this.userId, this.userRole);
  }

  popChapter(index: number): void {
    this.chapters.splice(index, 1);
  }

  async getChapters(): Promise<void> {
    const response = await Manga.chapters(this.mangaId, this.loading);

    if (response.data) {
      this.chapters = response.data;
      this.loading = false;
    } else {
      const notification = {
        color: 'error',
        context: this.$t('mangaChapters'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
  }

  @Watch('chapters')
  onChaptersUpdate(): void {
    if (this.chapters.length > 0) {
      this.firstChapter = this.chapters[this.chapters.length - 1].id;
    }
  }

  mounted(): void {
    this.getChapters();
  }
}
</script>

<style lang="scss">
.chapter-row {
  display: flex;
  align-items: center;
}
.theme--dark {
  .chapter-row {
    background-color: black;
    &:hover {
      background-color: #424242;
    }
    border-bottom: #212121 0.1rem solid;
    &:last-child {
      border-bottom: none;
    }
  }
}
.theme--light {
  .chapter-row {
    background-color: #eeeeee;
    &:hover {
      background-color: #e0e0e0;
    }
    border-bottom: #ffffff 0.1rem solid;
    &:last-child {
      border-bottom: none;
    }
  }
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<i18n locale="en" lang="yaml">
chapters: 'Chapters'
mangaChapters: 'Manga chapters'
</i18n>

<i18n locale="fr" lang="yaml">
chapters: 'Chapitres'
mangaChapters: 'Chapitres du manga'
</i18n>
