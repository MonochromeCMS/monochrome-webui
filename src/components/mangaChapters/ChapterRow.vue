<template>
  <div class="chapter-link d-flex align-center">
    <router-link
      :to="`/chapters/${chapter.id}`"
      class="d-block text-decoration-none"
      :style="`width: 100%`"
    >
      <v-row class="justify-space-around ma-0">
        <v-col cols="6" sm="3" md="2">
          {{ chapter.volume ? `Vol ${chapter.volume} ` : '' }}{{ $t('chapter') }}
          {{ chapter.number }}
        </v-col>
        <v-col cols="3" md="4" class="hidden-sm-and-down ellipsis">
          {{ chapter.name }}
        </v-col>
        <v-col cols="6" sm="4" md="3" class="ellipsis">
          {{ chapter.scanGroup }}
        </v-col>
        <v-col cols="3" lg="2" class="pa-0 text-right hidden-xs-only">
          <v-chip color="backgroundAlt" class="ma-2">
            {{ $t('timeAgo', { time: ago(new Date(chapter.uploadTime).getTime()) }) }}
          </v-chip>
        </v-col>
      </v-row>
    </router-link>
    <v-menu v-if="showEdit" offset-y close-on-content-click>
      <template #activator="{ on, attrs }">
        <v-btn tile icon v-bind="attrs" class="mr-1" aria-label="More options" v-on="on">
          <v-icon>{{ icons.mdiDotsVertical }}</v-icon>
        </v-btn>
      </template>
      <v-btn block color="background" :to="`/chapters/${chapter.id}/edit`">
        {{ $t('editChapter') }}
      </v-btn>
      <chapter-delete :id="chapter.id" @input="deleteChapter()" />
    </v-menu>
  </div>
</template>

<script lang="ts">
import { mdiDotsVertical } from '@mdi/js';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

import type { ChapterResponse } from '@/api/Chapter';

import ChapterDelete from './ChapterDelete.vue';

@Component({
  components: { ChapterDelete },
})
export default class ChapterRow extends Vue {
  @Prop() readonly chapter!: ChapterResponse;

  @Prop(Boolean) readonly showEdit!: boolean;

  icons = {
    mdiDotsVertical,
  };

  @Emit('delete')
  deleteChapter(): boolean {
    return true;
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
.chapter-link {
  width: 100%;
  height: 100%;
}
</style>

<i18n locale="en" lang="yaml">
chapter: 'Chapter'
editChapter: 'Edit chapter'
</i18n>

<i18n locale="fr" lang="yaml">
chapter: 'Chapitre'
editChapter: 'Modifier chapitre'
</i18n>
