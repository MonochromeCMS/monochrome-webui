<template>
  <v-tabs
    v-model="currentPage"
    background-color="backgroundAlt"
    show-arrows
    centered
    center-active
    class="reader-tabs"
  >
    <v-tab :key="0">
      {{ reverse ? $t('nextChapter') : $t('previousChapter') }}
    </v-tab>
    <v-tab v-for="index in amount" :key="index">
      {{ reverse ? amount - index + 1 : index }}
    </v-tab>
    <v-tab :key="amount + 1">
      {{ reverse ? $t('previousChapter') : $t('nextChapter') }}
    </v-tab>
  </v-tabs>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from 'vue-property-decorator';

@Component
export default class PagedReaderTabs extends Vue {
  @VModel() readonly currentPage!: number | null;

  @Prop(Number) readonly amount!: number;

  get reverse(): boolean {
    return !this.$store.getters.getDirection;
  }
}
</script>

<style lang="scss">
.reader-tabs {
  position: sticky;
  top: 0.7rem;
  z-index: 1;
  border-radius: 0.3rem;
  margin-bottom: 0.8rem;
}
</style>

<i18n locale="en" lang="yaml">
nextChapter: 'Next chapter'
previousChapter: 'Previous chapter'
</i18n>

<i18n locale="fr" lang="yaml">
nextChapter: 'Chapitre suivant'
previousChapter: 'Chapitre précédent'
</i18n>
