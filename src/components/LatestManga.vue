<template>
  <v-container>
    <v-card-title
      class="justify-center lemon-milk"
      v-text="$t(total <= limit ? 'manga' : 'recentlyAdded')"
    />
    <v-row v-if="!loading">
      <v-col class="pt-0">
        <v-list three-line color="backgroundAlt">
          <template v-for="(item, index) in manga">
            <v-divider v-if="item.divider" :key="index" :inset="item.inset"></v-divider>

            <v-list-item v-else :key="item.title" :to="item.to">
              <v-list-item-avatar size="3rem">
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-html="item.title"></v-list-item-title>
                <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
        <div v-if="manga.length === 0" class="text-center mb-2">{{ $t('noManga') }}</div>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-skeleton-loader
          class="w-100"
          type="list-item-avatar-three-line, divider, list-item-avatar-three-line"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Manga from '@/api/Manga';
import Media from '@/api/Media';
import type { MangaResponse } from '@/api/Manga';

@Component
export default class LatestManga extends Vue {
  loading = true;

  rawManga: MangaResponse[] = [];

  offset = 0;

  limit = 5;

  total = 0;

  get manga(): any[] {
    let m = this.rawManga
      .map((el) => [
        {
          avatar: Media.cover(el.id, el.version),
          title: el.title,
          subtitle: el.description,
          to: `/manga/${el.id}`,
        },
        { divider: true, inset: true },
      ])
      .reduce((acc, el) => [...acc, ...el], []);

    if (m.length !== 0) m.pop();
    return m;
  }

  async getManga(): Promise<void> {
    const response = await Manga.search(null, this.limit, this.offset, this.loading);

    if (response.data) {
      this.rawManga = response.data.results;
      this.total = response.data.total;
    } else {
      const notification = {
        context: this.$tc('latestManga'),
        message: response.error ?? '',
        color: 'error',
      };
      await this.$store.dispatch('pushNotification', notification);
    }

    this.loading = false;
  }

  mounted(): void {
    this.getManga();
  }
}
</script>

<i18n locale="en" lang="yaml">
latestManga: 'Latest manga'
manga: 'Manga'
recentlyAdded: 'Recently added'
</i18n>

<i18n locale="fr" lang="yaml">
latestManga: 'Derniers mangas ajoutés'
manga: 'Manga'
recentlyAdded: 'Ajoutés récemment'
</i18n>
