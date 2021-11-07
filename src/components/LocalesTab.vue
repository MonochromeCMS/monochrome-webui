<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-tab v-if="locales.length > 1" v-on="on" v-bind="attrs" class="lang-tab text-uppercase">
        {{ currentLocale }}
      </v-tab>
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
export default class LocalesTab extends Vue {
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
