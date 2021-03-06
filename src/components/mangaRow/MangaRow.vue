<template>
  <v-container>
    <manga-row-loading v-if="loading || !manga" />
    <v-row v-else align="center">
      <v-col cols="12" md="3"><v-img :src="cover" contain /></v-col>
      <v-col cols="12" md="9" class="d-flex flex-column justify-center">
        <v-tooltip top open-delay="600">
          <template #activator="{ on, attrs }">
            <h1
              class="text text-sm-6 text-md-h5 text-lg-h4 text-xl-h2 pb-2"
              v-bind="attrs"
              v-on="on"
            >
              {{ manga.title }}
            </h1>
          </template>
          <span v-text="manga.title" />
        </v-tooltip>
        <v-chip-group column>
          <v-chip
            class="chip-tag"
            :color="statusColor[manga.status] || 'gray'"
            v-text="upper(manga.status)"
          />
          <v-chip class="chip-tag" color="background">
            <span>{{ $t("author") }}</span> {{ manga.author }}
          </v-chip>
          <v-chip class="chip-tag" color="background">
            <span>{{ $t("artist") }}</span> {{ manga.artist }}
          </v-chip>
          <v-chip v-if="manga.year" class="chip-tag" color="background">
            <span>{{ $t("release") }}</span> {{ manga.year }}
          </v-chip>
        </v-chip-group>
        <div class="manga-desc" v-text="manga.description" />
        <slot />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"

import type { MangaSchema } from "@/api/Manga"

@Component
export default class MangaRow extends Vue {
  @Prop() readonly manga!: MangaSchema

  @Prop(String) readonly cover!: string

  @Prop(Boolean) readonly loading!: boolean

  statusColor = {
    cancelled: "red",
    completed: "green darken-2",
    hiatus: "orange",
    ongoing: "green",
  }

  upper(status: string): string {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : ""
  }
}
</script>

<style lang="scss">
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.manga-desc {
  margin: 0.5rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1.25rem;
  white-space: initial;
}
.chip-tag {
  margin: 0.3rem;
  span {
    font-weight: 700;
    margin-right: 0.2rem;
  }
}
</style>

<i18n locale="en" lang="yaml">
author: "Author:"
artist: "Artist:"
release: "Release:"
</i18n>

<i18n locale="fr" lang="yaml">
author: "Auteur:"
artist: "Artiste:"
release: "Parution:"
</i18n>
