<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="10" class="mx-auto">
        <v-card rounded="lg" color="backgroundAlt" elevation="0" class="pa-4">
          <v-card-title class="justify-center lemon-milk">{{ $t('editChapter') }}</v-card-title>
          <manga-row :loading="!manga" :manga="manga" :cover="cover" class="background rounded" />
          <v-card-text>
            <upload-form v-if="chapter && manga" :manga-id="manga.id" :chapter="chapter" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import type { ChapterResponse, DetailedChapterResponse } from '@/api/Chapter';
import Chapter from '@/api/Chapter';
import type { MangaResponse } from '@/api/Manga';
import Media from '@/api/Media';
import type { Role } from '@/api/User';
import MangaRow from '@/components/mangaRow/MangaRow.vue';
import UploadForm from '@/components/uploadForm/UploadForm.vue';

@Component({
  components: { MangaRow, UploadForm },
})
export default class About extends Vue {
  manga: MangaResponse | null = null;

  chapter: DetailedChapterResponse | null = null;

  get chapterId(): string {
    return this.$route.params.chapter;
  }

  get isConnected(): boolean {
    return this.$store.getters.isConnected;
  }

  get cover(): string {
    if (this.manga) {
      return Media.cover(this.manga.id, this.manga.version);
    } else {
      return '';
    }
  }

  get userId(): string {
    return this.$store.getters.userId;
  }

  get userRole(): Role {
    return this.$store.getters.userRole;
  }

  async getChapter(): Promise<void> {
    const response = await Chapter.get(this.chapterId);

    if (response.data) {
      this.chapter = response.data;
      this.manga = response.data.manga;
    } else {
      const notification = {
        color: 'error',
        context: this.$t('getChapter'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
  }

  @Watch('chapter')
  async onChapterUpdate(chapter: ChapterResponse) {
    if (!Chapter.canEdit(chapter, this.userId, this.userRole)) {
      const notification = {
        color: 'error',
        context: this.$t('editChapter'),
        message: "You aren't allowed to edit this chapter",
      };
      await this.$store.dispatch('pushNotification', notification);
      await this.$router.replace('/');
    }
  }

  mounted(): void {
    if (!this.isConnected) {
      this.$router.replace('/');
    } else {
      this.getChapter();
    }
  }
}
</script>

<i18n locale="en" lang="yaml">
getChapter: 'Get chapter'
editChapter: 'Edit chapter'
</i18n>

<i18n locale="fr" lang="yaml">
getChapter: 'Chargement du chapitre'
editChapter: 'Modification du chapitre'
</i18n>
