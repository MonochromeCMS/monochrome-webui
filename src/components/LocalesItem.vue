<template>
  <v-menu v-if="locales.length > 1" offset-y>
    <template #activator="{ on, attrs }">
      <v-list-item v-bind="attrs" class="lang-tab justify-end" v-on="on">
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
import { localize } from 'vee-validate';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class LocalesItem extends Vue {
  locales = (process.env.VUE_APP_I18N_LOCALES || 'en,fr').split(',');

  get currentLocale(): string {
    return this.$root.$i18n.locale;
  }

  changeLocale(locale: string): void {
    window.localStorage.setItem('monochrome-lang', locale);
    this.$root.$i18n.locale = locale;
    localize(locale);
  }

  mounted(): void {
    const locale = window.localStorage.getItem('monochrome-lang') || this.$i18n.locale;
    this.changeLocale(locale);
  }
}
</script>

<style>
.lang-tab {
  margin-left: auto;
}
</style>
