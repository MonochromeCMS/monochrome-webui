<script setup lang="ts">
const { t } = useI18n()

const links = computed(() => [
  {
    text: t('home'),
    to: '/',
  },
  {
    text: t('manga'),
    to: '/manga',
  },
  {
    text: t('about'),
    to: '/about',
  },
])

const route = useRoute()
const barModel = ref(true)
const hideInterface = computed(() => route.meta.hideInterface as boolean | undefined)
</script>

<template>
  <v-app-bar v-model="barModel" :hide-on-scroll="hideInterface" color="backgroundAlt" class="nav-bar" flat>
    <nav-title class="no-flex" />
    <nav-tabs class="hidden-sm-and-down ml-auto" :links="links" />
    <template #append>
      <nav-menu class="hidden-md-and-up" :links="links" />
      <nav-append-tabs class="hidden-sm-and-down" />
    </template>
  </v-app-bar>
</template>

<style>
.nav-bar {
  border-bottom: 1px solid rgb(var(--v-theme-background));
}

.no-flex {
  flex: unset !important;
}

.v-toolbar__append {
  margin-right: 0;
}
</style>

<i18n locale="en" lang="yaml">
home: Home
manga: Manga
about: About
</i18n>

<i18n locale="fr" lang="yaml">
home: Accueil
manga: Manga
about: À propos
</i18n>
