<script setup lang="ts">
import type { MangaSchema } from '@/api/Manga'

defineProps<{
  manga?: MangaSchema | null
  cover: string
}>()

const { t } = useI18n()

const statusColor = {
  cancelled: 'red',
  completed: 'green-darken-2',
  hiatus: 'orange',
  ongoing: 'green',
}

const upper = (t: string) => (t ? t[0].toUpperCase() + t.slice(1) : t)
</script>

<template>
  <v-row v-if="manga" align="center" class="ma-0">
    <v-col cols="12" md="3">
      <v-img :src="cover" />
    </v-col>
    <v-col cols="12" md="9" class="d-flex flex-column justify-center">
      <h1 class="text text-sm-6 text-md-h5 text-lg-h4 text-xl-h3 pb-4">
        {{ manga.title }}
        <v-tooltip location="top" activator="parent">
          {{ manga.title }}
        </v-tooltip>
      </h1>
      <div class="chip-flex">
        <v-chip
          variant="flat"
          :color="statusColor[manga.status] || 'primary'"
          :text="upper(manga.status)"
        />
        <v-chip variant="outlined" color="primary">
          <span>{{ t("author") }}</span> {{ manga.author }}
        </v-chip>
        <v-chip variant="outlined" color="primary">
          <span>{{ t("artist") }}</span> {{ manga.artist }}
        </v-chip>
        <v-chip v-if="manga.year" variant="outlined" color="primary">
          <span>{{ t("release") }}</span> {{ manga.year }}
        </v-chip>
      </div>
      <div class="manga-desc" v-text="manga.description" />
      <slot />
    </v-col>
  </v-row>
</template>

<style lang="scss">
.chip-flex {
  .v-chip {
    margin-bottom: 0.5rem;
    margin-right: 0.5rem;
    > span {
      margin-right: 0.3rem;
    }
  }
}
.manga-desc {
  text-align: justify;
  margin: 0.5rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1.25rem;
  white-space: initial;
}
</style>

<i18n locale="en" lang="yaml">
author: 'Author:'
artist: 'Artist:'
release: 'Release:'
</i18n>

<i18n locale="fr" lang="yaml">
author: 'Auteur:'
artist: 'Artiste:'
release: 'Parution:'
</i18n>
