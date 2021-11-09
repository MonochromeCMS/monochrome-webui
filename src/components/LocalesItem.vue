<template>
  <v-menu v-if="locales.length > 1" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-on="on" v-bind="attrs" class="lang-tab justify-end">
        {{ currentLocale }}
      </v-list-item>
    </template>
    <v-list>
      <v-list-item
        v-for="locale in locales"
        :key="locale"
        class="text-uppercase"
        :class="locale === currentLocale ? 'background' : ''"
        @click="changeLocale(locale)"
      >
        {{ locale }}
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class LocalesItem extends Vue {
  locales = ['en', 'fr'];

  get currentLocale(): string {
    return this.$root.$i18n.locale;
  }

  changeLocale(locale: string): void {
    window.localStorage.setItem('monochrome-lang', locale);
    this.$root.$i18n.locale = locale;
  }

  mounted(): void {
    this.$root.$i18n.locale = window.localStorage.getItem('monochrome-lang') || this.$i18n.locale;
  }
}
</script>

<style>
.lang-tab {
  margin-left: auto;
}
</style>
