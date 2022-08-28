<template>
  <v-container>
    <v-row class="mb-3">
      <!-- VOLUME FIELD -->
      <v-col cols="12" sm="6" md="4" class="pa-3 pb-0">
        <v-text-field
          v-model="volume"
          :rules="[f.numeric]"
          :label="$t('volumeNumber')"
          hide-details="auto"
          outlined
          min="1"
        />
      </v-col>
      <!-- NUMBER FIELD -->
      <v-col cols="12" sm="6" md="4" class="pa-3 pb-0">
        <v-text-field
          v-model="number"
          :rules="[f.required, f.regex(/^[0-9.]+$/)]"
          :label="$t('chapterNumber')"
          required
          hide-details="auto"
          outlined
        />
      </v-col>
      <!-- GROUP FIELD -->
      <v-col cols="12" md="4" class="pa-3 pb-0">
        <v-combobox
          v-model="scanGroup"
          :items="groupAutocomplete"
          :rules="[f.required]"
          :label="$t('scanGroup')"
          outlined
          hide-details="auto"
        />
      </v-col>
    </v-row>
    <!-- NAME FIELD -->
    <v-text-field v-model="name" :label="$t('chapterName')" hide-details="auto" outlined />

    <!-- NAME FIELD -->
    <v-checkbox v-model="webtoon" :label="$t('webtoonDescription')" hide-details="auto" />

    <v-divider class="my-3" />

    <v-btn v-if="chapter && !session" color="info" @click="createSession()">
      {{ $t("editPages") }}
    </v-btn>

    <page-input
      v-if="session"
      v-model="pageOrder"
      :session="session"
      :disabled="disabled"
      :webtoon="webtoon"
    />

    <div class="text-center mt-4">
      <v-btn :loading="disabled" type="submit" block color="background" class="text--primary">
        {{ chapter ? $t("editChapter") : $t("uploadChapter") }}
      </v-btn>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator"

import Autocomplete from "@/api/Autocomplete"
import type { ChapterResponse, ChapterSchema } from "@/api/Chapter"
import type { UploadSessionResponse } from "@/api/Upload"
import { numeric, regex, required } from "@/formRules"

export interface UploadSubmitEvent {
  chapterDraft: ChapterSchema
  pageOrder: string[]
}

@Component
export default class UploadFormFields extends Vue {
  @Prop(String) readonly mangaId!: string

  @Prop(Boolean) readonly disabled!: boolean

  @Prop() readonly session!: UploadSessionResponse | null

  @Prop() readonly chapter!: ChapterResponse | null

  f = { numeric, regex, required }

  groupAutocomplete: string[] = []

  name = ""

  volume?: number | null = null

  number?: number | null = null

  webtoon = false

  pageOrder: string[] = []

  scanGroup = "no group"

  get chapterDraft(): ChapterSchema {
    return {
      name: this.name,
      number: this.number ?? 0,
      scanGroup: this.scanGroup,
      volume: this.volume ?? undefined,
      webtoon: this.webtoon,
    }
  }

  @Emit("session")
  createSession(): boolean {
    return true
  }

  public clear(): void {
    this.name = ""
    this.number = undefined
    this.volume = null
    this.webtoon = false
    this.scanGroup = "no group"
  }

  async autocomplete(): Promise<void> {
    const response = await Autocomplete.groups()

    if (response.data) {
      this.groupAutocomplete = response.data
    } else {
      const notification = {
        color: "error",
        context: this.$t("groupAutocomplete"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }
  }

  mounted(): void {
    if (this.chapter) {
      this.name = this.chapter.name
      this.number = this.chapter.number
      this.volume = this.chapter.volume
      this.webtoon = this.chapter.webtoon
      this.scanGroup = this.chapter.scanGroup
    }
    this.autocomplete()
  }
}
</script>

<i18n locale="en" lang="yaml">
volumeNumber: "Volume number"
chapterNumber: "Chapter number"
scanGroup: "Scan group"
chapterName: "Chapter name"
webtoonDescription: "This chapter is a webtoon (the webtoon reader will be used)"
editPages: "Edit pages"
editChapter: "Edit chapter"
uploadChapter: "Upload chapter"
createSession: "Create upload session"
commitSession: "Commit upload session"
groupAutocomplete: "Group autocomplete"
</i18n>

<i18n locale="fr" lang="yaml">
volumeNumber: "Numéro de volume"
chapterNumber: "Numéro de chapitre"
scanGroup: "Nom du groupe"
chapterName: "Nom du chapitre"
webtoonDescription: "Ce chapitre est un webtoon (le lecteur de webtoon sera utilisé)"
editPages: "Modifier les pages"
editChapter: "Modifier le chapitre"
uploadChapter: "Ajouter un chapitre"
createSession: "Création de session"
commitSession: "Confirmation de session"
groupAutocomplete: "Autocomplétion de groupe"
</i18n>
