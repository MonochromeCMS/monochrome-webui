<template>
  <v-card color="background" class="px-4" :to="`/chapters/${chapter.id}`">
    <v-row align="center">
      <v-col cols="3">
        <v-img :src="cover(chapter.mangaId, chapter.manga.version)" max-height="7rem" />
      </v-col>
      <v-col cols="8" class="d-flex flex-column justify-center">
        <h2 class="text-subtitle-1 ellipsis">
          {{ chapter.manga.title }}
        </h2>
        <h3 class="text-subtitle-2 ellipsis">
          {{ `${$t('chapter')} ${chapter.number}${chapter.name ? ' - ' + chapter.name : ''}` }}
        </h3>
        <h4 class="text-caption">{{ chapter.scanGroup }}</h4>
        <v-chip color="backgroundAlt" class="chip-tag">
          {{ $t('timeAgo', { time: ago(new Date(chapter.uploadTime).getTime()) }) }}
        </v-chip>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import type { DetailedChapterResponse } from '@/api/Chapter';
import Media from '@/api/Media';

@Component
export default class ChapterCard extends Vue {
  @Prop() chapter!: DetailedChapterResponse;

  cover(mangaId: string, version: number): string {
    return Media.cover(mangaId, version);
  }

  ago(val: number): string {
    val = 0 | ((Date.now() - val) / 1000);

    const length = new Map([
      ['second', 60],
      ['minute', 60],
      ['hour', 24],
      ['day', 7],
      ['week', 4.35],
      ['month', 12],
      ['year', 10000],
    ]);

    for (const [k, l] of length) {
      const result = val % l;
      if (!(val = 0 | (val / l))) {
        return this.$tc(`timeUnits.${k}`, result);
      }
    }
    return 'ERROR';
  }
}
</script>

<style lang="scss">
.v-chip.chip-tag {
  margin-top: 0.2rem;
  max-width: max-content;
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<i18n locale="en" lang="yaml">
chapter: 'Chapter'
</i18n>

<i18n locale="fr" lang="yaml">
chapter: 'Chapitre'
</i18n>
