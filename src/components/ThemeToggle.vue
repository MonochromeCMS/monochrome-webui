<template>
  <v-btn
    fab
    outlined
    color="primary"
    class="theme-toggle"
    aria-label="Theme toggle"
    @click="toggleTheme"
  >
    <v-icon large>{{ icons.mdiLightbulb }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { mdiLightbulb } from '@mdi/js';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ThemeToggle extends Vue {
  icons = {
    mdiLightbulb,
  };

  toggleTheme(): void {
    const dark = !this.$vuetify.theme.dark;
    window.localStorage.setItem('monochrome-dark', dark ? '1' : '0');
    this.$vuetify.theme.dark = dark;
  }

  mounted(): void {
    this.$vuetify.theme.dark = window.localStorage.getItem('monochrome-dark') === '1';
  }
}
</script>

<style lang="scss">
.theme-toggle {
  position: fixed;
  left: 1rem;
  bottom: 1rem;
}
</style>
