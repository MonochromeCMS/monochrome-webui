<template>
  <v-container>
    <v-row>
      <v-col><search-bar v-model="search" /></v-col>
    </v-row>
    <manga-page-loading v-if="loading" :amount="limit" />
    <v-row v-else>
      <v-col v-if="manga.length === 0" class="text-center text-body-1">
        {{ search ? $t('noMangaFound') : $t('noManga') }}
      </v-col>
      <v-col v-for="item in manga" v-else :key="item.id" cols="12" sm="6" md="4" lg="3">
        <manga-card :manga="item" />
      </v-col>
    </v-row>
    <v-row v-if="pageAmount > 1">
      <v-pagination
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

import type { MangaResponse } from '@/api/Manga';
import Manga from '@/api/Manga';

import MangaCard from './MangaCard.vue';
import MangaPageLoading from './MangaPageLoading.vue';
import SearchBar from './SearchBar.vue';

@Component({
  components: { MangaCard, MangaPageLoading, SearchBar },
})
export default class MangaPage extends Vue {
  loading = true;

  manga: MangaResponse[] = [];

  limit = 12;

  page = 1;

  total = 0;

  search: any = null;

  get offset(): number {
    return (this.page - 1) * this.limit;
  }

  get pageAmount(): number {
    return Math.ceil(this.total / this.limit);
  }

  async getManga(): Promise<void> {
    const response = await Manga.search(this.search, this.limit, this.offset, this.loading);

    if (response.data) {
      this.manga = response.data.results;
      this.total = response.data.total;
    } else {
      const notification = {
        color: 'error',
        context: this.$t('mangaPagination'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
    }

    this.loading = false;
  }

  @Watch('page')
  onPageUpdate(): void {
    this.getManga();
  }

  @Watch('search')
  onSearch(): void {
    if (this.page === 1) {
      this.getManga();
    } else {
      this.page = 1;
    }
  }

  mounted(): void {
    if (this.$route.query.q) {
      this.search = this.$route.query.q.length ? this.$route.query.q[0] : this.$route.query.q;
    } else {
      this.getManga();
    }
  }
}
</script>

<i18n locale="en" lang="yaml">
noMangaFound: 'No manga could be found.'
mangaPagination: 'Manga pagination'
</i18n>

<i18n locale="fr" lang="yaml">
noMangaFound: "Aucun manga n'a pu être trouvé."
mangaPagination: 'Liste manga'
</i18n>
