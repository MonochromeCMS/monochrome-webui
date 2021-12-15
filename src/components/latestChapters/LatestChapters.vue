<template>
  <v-container>
    <v-card-title class="justify-center lemon-milk">{{ $t('latestChapters') }}</v-card-title>
    <latest-chapters-loading v-if="loading" :amount="limit" :columns="isConnected ? 1 : 2" />
    <v-row v-else class="mx-0 mb-0">
      <v-col v-if="chapters.length === 0" cols="12" class="text-center text-body-1">
        {{ $t('noChapters') }}
      </v-col>
      <v-col
        v-for="chapter in chapters"
        :key="chapter.id"
        cols="12"
        sm="6"
        :lg="isConnected ? 12 : 6"
        xl="6"
        class="px-2 my-2"
      >
        <chapter-card :chapter="chapter" />
      </v-col>
    </v-row>

    <v-row>
      <v-pagination
        v-if="pageAmount > 1"
        v-model="page"
        class="mx-auto pb-4"
        color="background text--primary"
        :length="pageAmount"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import type { DetailedChapterResponse } from '@/api/Chapter';
import Chapter from '@/api/Chapter';

@Component
export default class LatestChapters extends Vue {
  page = 1;

  limit = 8;

  total = 0;

  loading = true;

  chapters: DetailedChapterResponse[] = [];

  get pageAmount(): number {
    return Math.ceil(this.total / this.limit);
  }

  get offset(): number {
    return (this.page - 1) * this.limit;
  }

  get isConnected(): boolean {
    return this.$store.getters.isConnected;
  }

  @Watch('page')
  async onPageChange(): Promise<void> {
    await this.getChapters();
  }

  async getChapters(): Promise<void> {
    const response = await Chapter.latest(this.limit, this.offset, this.loading);

    if (response.data) {
      this.chapters = response.data.results;
      this.total = response.data.total;
    } else {
      const notification = {
        color: 'error',
        context: this.$t('latestChapters'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
    }

    this.loading = false;
  }

  mounted(): void {
    this.getChapters();
  }
}
</script>

<i18n locale="en" lang="yaml">
latestChapters: 'Latest chapters'
</i18n>

<i18n locale="fr" lang="yaml">
latestChapters: 'Derniers chapitres'
</i18n>
