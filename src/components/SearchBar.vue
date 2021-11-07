<template>
  <v-text-field
    hide-details
    clearable
    :label="$t('search')"
    solo
    :value="value"
    color="primary"
    background-color="background"
    :prepend-inner-icon="icons.mdiMagnify"
    :loading="loading"
    dense
    @input="searchInput"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { debounce } from 'typescript-debounce-decorator';
import { mdiMagnify } from '@mdi/js';

@Component
export default class SearchBar extends Vue {
  @Prop(String) value!: string;

  icons = {
    mdiMagnify,
  };

  loading = false;

  @debounce(1200)
  _searchInput(value: string): void {
    this.$emit('input', value);
    this.$emit('update:value', value);
    this.loading = false;
  }

  searchInput(value: string): void {
    this.loading = true;
    this._searchInput(value);
  }
}
</script>

<i18n locale="en" lang="yaml">
search: 'Search'
</i18n>

<i18n locale="fr" lang="yaml">
search: 'Recherche'
</i18n>
