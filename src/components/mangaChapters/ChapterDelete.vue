<template>
  <v-dialog v-model="dialog" max-width="30rem">
    <template #activator="{ on, attrs }">
      <v-btn color="error" block v-bind="attrs" v-on="on">{{ $t("deleteChapter") }}</v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 background mb-2">{{ $t("warning") }}</v-card-title>

      <v-card-text class="body-1">
        <span class="font-weight-bold">{{ $t("warningBoldMessage") }}</span>
        {{ $t("warningMessage") }}
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="gray" text @click="dialog = false">{{ $t("cancel") }}</v-btn>
        <v-btn color="error" @click="deleteChapter">{{ $t("delete") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { AxiosRequestConfig } from "axios"
import { Component, Prop, Vue } from "vue-property-decorator"

import Chapter from "@/api/Chapter"

@Component
export default class ChapterDelete extends Vue {
  dialog = false

  @Prop() readonly id!: string

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig
  }

  async deleteChapter(): Promise<void> {
    const response = await Chapter.delete(this.id, this.authConfig)

    if (response.data) {
      this.$emit("input", true)
      this.dialog = false
    } else {
      const notification = {
        color: "error",
        context: this.$tc("deleteChapter"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }
  }
}
</script>

<i18n locale="en" lang="yaml">
deleteChapter: "Delete chapter"
warningMessage: "Are you sure you want to delete this chapter?"
</i18n>

<i18n locale="fr" lang="yaml">
deleteChapter: "Supprimer le chapitre"
warningMessage: "Êtes-vous sûr de vouloir supprimer ce chapitre ?"
</i18n>
