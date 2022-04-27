<template>
  <v-form @submit.prevent="submit()">
    <!-- TITLE FIELD -->
    <validation-provider v-slot="{ errors }" :name="$t('title')" rules="required">
      <v-text-field
        v-model="title"
        :error-messages="errors"
        :label="$t('title')"
        required
        outlined
      />
    </validation-provider>
    <!-- DESC FIELD -->
    <validation-provider v-slot="{ errors }" :name="$t('description')" rules="required">
      <v-textarea
        v-model="description"
        :error-messages="errors"
        :label="$t('description')"
        required
        outlined
      />
    </validation-provider>
    <!-- AUTHOR FIELD -->
    <validation-provider v-slot="{ errors }" :name="$t('author')" rules="required">
      <v-text-field
        v-model="author"
        :error-messages="errors"
        :label="$t('author')"
        required
        outlined
      />
    </validation-provider>
    <!-- ARTIST FIELD -->
    <validation-provider v-slot="{ errors }" :name="$t('artist')" rules="required">
      <v-text-field
        v-model="artist"
        :error-messages="errors"
        :label="$t('artist')"
        required
        outlined
      />
    </validation-provider>
    <!-- YEAR FIELD -->
    <validation-provider v-slot="{ errors }" :name="$t('year')" :rules="{ digits: 4 }">
      <v-text-field
        v-model="year"
        type="number"
        :error-messages="errors"
        :label="$t('year')"
        required
        outlined
      />
    </validation-provider>
    <!-- STATUS FIELD -->
    <validation-provider v-slot="{ errors }" :name="$t('status')" rules="required">
      <v-select
        v-model="status"
        class="status-list"
        :items="statusItems"
        :error-messages="errors"
        :label="$t('status')"
        outlined
      />
    </validation-provider>
    <!-- COVER FIELD -->
    <validation-provider v-slot="{ errors }" :name="$t('cover')" :rules="manga ? '' : 'required'">
      <v-file-input v-model="cover" :error-messages="errors" accept="image/*" :label="$t('cover')">
      </v-file-input>
    </validation-provider>
    <!-- PREVIEW -->
    <v-expansion-panels class="mb-4">
      <v-expansion-panel>
        <v-expansion-panel-header>{{ $t("preview") }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <manga-row :loading="false" :manga="params" :cover="url(cover) || ''" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <div class="text-center">
      <v-btn type="submit" block color="background" class="text--primary">
        {{ manga ? $t("editManga") : $t("createManga") }}
      </v-btn>
    </div>
  </v-form>
</template>

<script lang="ts">
import { Component, Emit, Prop, VModel, Vue, Watch } from "vue-property-decorator"

import type { MangaResponse, MangaSchema, Status } from "@/api/Manga"
import Media from "@/api/Media"

@Component
export default class MangaFields extends Vue {
  @Prop() readonly manga!: MangaResponse | null

  @VModel() readonly cover!: File | null

  title = ""

  description = ""

  author = ""

  artist = ""

  year?: number | null = null

  status: Status | null = null

  statusItems = [
    { text: this.upper(this.$tc("ongoing")), value: "ongoing" },
    { text: this.upper(this.$tc("hiatus")), value: "hiatus" },
    { text: this.upper(this.$tc("completed")), value: "completed" },
    { text: this.upper(this.$tc("cancelled")), value: "cancelled" },
  ]

  get params(): MangaSchema {
    return {
      artist: this.artist,
      author: this.author,
      description: this.description,
      status: this.status ?? "ongoing",
      title: this.title,
      year: this.year ?? undefined,
    }
  }

  url(blob: File | null): string | null {
    if (blob) {
      return blob ? URL.createObjectURL(blob) : null
    } else {
      return this.manga ? Media.cover(this.manga.id, this.manga.version) : null
    }
  }

  @Emit("submit")
  submit(): MangaSchema {
    return this.params
  }

  upper(str: string): string {
    return str ? str[0].toUpperCase() + str.slice(1) : ""
  }

  clear(): void {
    this.title = ""
    this.description = ""
    this.author = ""
    this.artist = ""
    this.year = null
    this.status = null
  }

  set(manga: MangaSchema): void {
    this.title = manga.title
    this.description = manga.description
    this.author = manga.author
    this.artist = manga.artist
    this.year = manga.year
    this.status = manga.status
  }

  @Watch("manga")
  onMangaChange(value: MangaSchema) {
    this.set(value)
  }

  mounted(): void {
    if (this.manga) {
      this.set(this.manga)
    }
  }
}
</script>

<i18n locale="en" lang="yaml">
title: "Title"
description: "Description"
author: "Author"
artist: "Artist"
year: "Year of release"
status: "Status"
cover: "Cover"
preview: "Preview"
editManga: "Edit manga"
createManga: "Create manga"
setCover: "Set cover"
</i18n>

<i18n locale="fr" lang="yaml">
title: "Titre"
description: "Description"
author: "Auteur"
artist: "Artiste"
year: "Année de parution"
status: "Status"
cover: "Couverture"
preview: "Aperçu"
editManga: "Modifier manga"
createManga: "Créer manga"
setCover: "Définir couverture"
</i18n>
