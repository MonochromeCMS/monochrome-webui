<template>
  <v-dialog v-model="menu" max-width="30rem">
    <template #activator="{ on, attrs }">
      <v-btn fab outlined v-bind="attrs" class="reader-button" color="primary" v-on="on">
        <v-icon>{{ icons.mdiMenu }}</v-icon>
      </v-btn>
    </template>
    <v-card rounded="lg" color="backgroundAlt">
      <v-card-title>
        <router-link :to="`/manga/${chapter.manga.id}`" class="text-decoration-none">
          {{ chapter.manga.title }}
        </router-link>
        <v-btn icon class="ml-auto" @click="menu = false">
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-select
          :label="$t('chapter')"
          hide-details
          :value="chapter.id"
          :items="chapterItems"
          @change="goToChapter"
        />
        <v-divider class="mt-3" />
        <v-subheader>{{ $t('readerSettings') }}</v-subheader>
        <v-select v-model="readerMode" :label="$t('readerMode')" hide-details :items="modeItems" />
        <!-- Width setting -->
        <v-slider
          v-if="readerMode === 'Webtoon'"
          v-model="width"
          class="ma-4 mb-1"
          hide-details
          step="5"
          min="5"
          thumb-color="text--primary background"
          max="100"
          :label="$t('width')"
          thumb-label
        >
          <template #thumb-label="{ value }"> {{ value }}% </template>
        </v-slider>
        <!-- Fit setting -->
        <v-row v-else align="center" class="ma-1">
          <v-col class="text-body-1">{{ $t('imageFit') }}</v-col>
          <v-col class="text-right pa-2">
            <v-btn-toggle v-model="fit" mandatory>
              <v-btn color="background">
                <v-icon>{{ icons.mdiArrowExpandHorizontal }}</v-icon>
              </v-btn>
              <v-btn color="background">{{ $t('default') }}</v-btn>
              <v-btn color="background">
                <v-icon>{{ icons.mdiArrowExpandVertical }}</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <!-- Direction setting -->
        <v-row v-if="['Single', 'Double'].includes(readerMode)" align="center" class="ma-1">
          <v-col class="text-body-1">{{ $t('pageDirection') }}</v-col>
          <v-col class="text-right pa-2">
            <v-btn-toggle v-model="direction" mandatory>
              <v-btn color="background">
                <v-icon>{{ icons.mdiArrowLeft }}</v-icon>
              </v-btn>
              <v-btn color="background">
                <v-icon>{{ icons.mdiArrowRight }}</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <!-- Double parity setting -->
        <v-row v-if="readerMode === 'Double'" align="center" class="ma-1">
          <v-col class="text-body-1">{{ $t('doublePageParity') }}</v-col>
          <v-col class="text-right pa-2">
            <v-btn-toggle v-model="doubleParity" mandatory>
              <v-btn color="background">{{ $t('even') }}</v-btn>
              <v-btn color="background">{{ $t('odd') }}</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  mdiArrowExpandHorizontal,
  mdiArrowExpandVertical,
  mdiArrowLeft,
  mdiArrowRight,
  mdiClose,
  mdiMenu,
} from '@mdi/js';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ReaderMenu extends Vue {
  @Prop() readonly chapter!: any;

  @Prop() readonly chapterItems!: any;

  icons = {
    mdiArrowExpandHorizontal,
    mdiArrowExpandVertical,
    mdiArrowLeft,
    mdiArrowRight,
    mdiClose,
    mdiMenu,
  };

  menu = false;

  @Emit()
  goToChapter(id: string): string {
    return id;
  }

  get modeItems(): string[] {
    return this.chapter.webtoon ? ['Webtoon'] : ['Single', 'Double', 'Vertical'];
  }

  get doubleParity(): number {
    return this.$store.getters.getParity;
  }

  set doubleParity(value: number) {
    this.$store.commit('setParity', value);
  }

  get fit(): number {
    const value = this.$store.getters.getFit;
    switch (value) {
      case 'width':
        return 0;
      case 'height':
        return 2;
      default:
        return 1;
    }
  }

  set fit(value: number) {
    switch (value) {
      case 0:
        this.$store.commit('setFit', 'width');
        break;
      case 2:
        this.$store.commit('setFit', 'height');
        break;
      default:
        this.$store.commit('setFit', 'default');
        break;
    }
  }

  get width(): number {
    return Number(this.$store.getters.getWidth.slice(0, -1));
  }

  set width(value: number) {
    this.$store.commit('setWidth', `${value}%`);
  }

  get direction(): number {
    return this.$store.getters.getDirection;
  }

  set direction(value: number) {
    this.$store.commit('setDirection', value);
  }

  get readerMode(): string {
    return this.chapter.webtoon ? 'Webtoon' : this.$store.getters.getReaderMode;
  }

  set readerMode(value: string) {
    if (!this.chapter.webtoon) {
      this.$store.commit('setReaderMode', value);
    }
  }
}
</script>

<style>
.reader-button {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
}
</style>

<i18n locale="en" lang="yaml">
chapter: 'Chapter'
readerSettings: 'Reader settings'
readerMode: 'Reader mode'
width: 'Width'
imageFit: 'Image fit'
pageDirection: 'Page direction'
doublePageParity: 'Double page parity'
default: 'Default'
even: 'Even'
odd: 'Odd'
</i18n>

<i18n locale="fr" lang="yaml">
chapter: 'Chapitre'
readerSettings: 'Paramètres du lecteur'
readerMode: 'Mode de lecture'
width: 'Largeur'
imageFit: "Ajustement de l'image"
pageDirection: 'Direction de lecture'
doublePageParity: 'Parité des pages'
default: 'Défaut'
even: 'Paire'
odd: 'Impaire'
</i18n>
