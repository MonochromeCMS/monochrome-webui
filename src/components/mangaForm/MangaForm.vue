<template>
  <v-form ref="formRef" v-model="valid" @submit.prevent="submit">
    <manga-fields ref="fields" v-model="cover" :manga="manga" @submit="submit" />
  </v-form>
</template>

<script lang="ts">
import type { AxiosRequestConfig } from "axios"
import { Component, Prop, Ref, Vue } from "vue-property-decorator"

import type { MangaResponse, MangaSchema } from "@/api/Manga"
import Manga from "@/api/Manga"
import type { IVForm } from "@/formRules"

import type MangaFields from "./MangaFields.vue"

@Component
export default class MangaForm extends Vue {
  @Ref() readonly formRef!: IVForm

  @Ref() readonly fields!: MangaFields

  @Prop() readonly manga!: MangaResponse | null

  valid = false

  cover: File | null = null

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig
  }

  async submit(): Promise<void> {
    this.formRef.validate()
    if (this.valid) {
      if (this.manga) {
        await this.editManga(this.fields.params, this.manga.id)
      } else {
        await this.createManga(this.fields.params)
      }
    }
  }

  clear(): void {
    this.fields.clear()
    this.formRef.reset()
  }

  async createManga(params: MangaSchema): Promise<void> {
    const response = await Manga.create(params, this.authConfig)

    if (response.data) {
      if (this.cover) {
        await this.setCover(response.data.id, this.cover)
      } else {
        await this.$router.push(`/manga/${response.data.id}`)
      }
      this.clear()
    } else {
      const notification = {
        color: "error",
        context: this.$t("createManga"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }
  }

  async editManga(params: MangaSchema, id: string): Promise<void> {
    const response = await Manga.edit(id, params, this.authConfig)

    if (response.data) {
      if (this.cover) {
        await this.setCover(id, this.cover)
      } else {
        await this.$router.push(`/manga/${id}`)
      }
      this.clear()
    } else {
      const notification = {
        color: "error",
        context: this.$t("editManga"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }
  }

  async setCover(mangaId: string, cover: File): Promise<void> {
    const response = await Manga.setCover(mangaId, cover, this.authConfig)

    if (response.data) {
      this.cover = null
      await this.$router.push(`/manga/${mangaId}`)
    } else {
      const notification = {
        color: "error",
        context: this.$t("setCover"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }
  }
}
</script>
