<template>
  <v-tabs
    v-model="currentPage"
    v-scroll="onScroll"
    background-color="backgroundAlt"
    show-arrows
    centered
    center-active
    :class="scrollClass"
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
import { Scroll } from 'vuetify/lib';

@Component({
  directives: { scroll: Scroll },
})
export default class PagedReaderTabs extends Vue {
  @VModel() readonly currentPage!: number | null;

  @Prop(Number) readonly amount!: number;

  currentScroll = 0;

  scrollClass = '';

  currentThreshold = 8;

  isScrollingUp = false;

  get reverse(): boolean {
    return !this.$store.getters.getDirection;
  }

  onScroll(ev: any): void {
    const newScroll = ev.target.scrollingElement.scrollTop;

    const scrollAmount = Math.abs(newScroll - this.currentScroll);

    if (newScroll > this.currentScroll === this.isScrollingUp) {
      this.currentThreshold = 8;
      this.isScrollingUp = !this.isScrollingUp;
    }

    if (scrollAmount > this.currentThreshold) {
      this.scrollClass = newScroll > this.currentScroll ? 'tabs-scrolling' : '';
    } else {
      this.currentThreshold -= scrollAmount;
    }

    this.currentScroll = newScroll;
  }
}
</script>

<style lang="scss">
.reader-tabs {
  position: sticky;
  top: 76px;
  z-index: 1;
  border-radius: 0.3rem;
  margin-bottom: 0.8rem;
  transition-duration: 0.28s;
  transition-property: box-shadow, transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.tabs-scrolling {
  transform: translateY(-64px);
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
