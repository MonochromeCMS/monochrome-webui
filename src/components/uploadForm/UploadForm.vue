<template>
  <validation-observer ref="observer">
    <upload-form-fields
      ref="fields"
      :disabled="loading"
      :manga-id="mangaId"
      :chapter="chapter"
      :session="session"
      @session="createSession(mangaId, chapter.id)"
      @submit="submit"
    />
  </validation-observer>
</template>

<script lang="ts">
import type { AxiosRequestConfig } from "axios"
import type { ValidationObserver } from "vee-validate"
import { Component, Prop, Ref, Vue } from "vue-property-decorator"

import type { ChapterResponse, ChapterSchema } from "@/api/Chapter"
import Chapter from "@/api/Chapter"
import type { UploadSessionResponse } from "@/api/Upload"
import Upload from "@/api/Upload"

import type { UploadSubmitEvent } from "./UploadFormFields.vue"
import type UploadFormFields from "./UploadFormFields.vue"

@Component
export default class UploadForm extends Vue {
  @Ref() readonly observer!: InstanceType<typeof ValidationObserver>

  @Ref() readonly fields!: UploadFormFields

  @Prop(String) readonly mangaId!: string

  @Prop() readonly chapter!: ChapterResponse

  session: UploadSessionResponse | null = null

  loading = false

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig
  }

  clear(): void {
    this.fields.clear()
    this.observer.reset()
  }

  async submit(ev: UploadSubmitEvent): Promise<void> {
    const valid = await this.observer.validate()
    if (valid) {
      switch (true) {
        case this.chapter && !this.session:
          await this.editChapter(ev.chapterDraft)
          break
        case this.session && ev.pageOrder.length > 0:
          await this.commitSession(ev.chapterDraft, ev.pageOrder)
      }
    }
  }

  async createSession(mangaId: string, chapter: string | null): Promise<void> {
    const config = this.authConfig
    const response = await Upload.begin(mangaId, chapter, config)

    if (response.data) {
      this.session = response.data
      this.$router.replace({ path: "", query: { id: response.data.id } })
    } else {
      const notification = {
        color: "error",
        context: this.$t("createSession"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }
  }

  async getSession(sessionId: string): Promise<void> {
    const response = await Upload.get(sessionId, this.authConfig)

    if (response.data) {
      if (this.mangaId != response.data.mangaId) {
        const notification = {
          color: "error",
          context: this.$t("createSession"),
          message: "The session's manga doesn't match",
        }
        await this.$store.dispatch("pushNotification", notification)
        this.$router.replace("")
      } else if (this.chapter && this.chapter.id !== response.data.chapterId) {
        const notification = {
          color: "error",
          context: this.$t("createSession"),
          message: "The session's chapter doesn't match",
        }
        await this.$store.dispatch("pushNotification", notification)
        this.$router.replace("")
      } else {
        this.session = response.data
      }
    } else {
      console.log("D")
      const notification = {
        color: "error",
        context: this.$t("getSession"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
      this.$router.replace("")
    }
  }

  async commitSession(chapterDraft: ChapterSchema, pageOrder: string[]): Promise<void> {
    if (!this.session?.id) {
      return
    }

    this.loading = true
    const config = this.authConfig
    const response = await Upload.commit(this.session.id, chapterDraft, pageOrder, config)

    if (response.data) {
      this.clear()
      await this.$router.push(`/chapters/${response.data.id}`)
    } else {
      const notification = {
        color: "error",
        context: this.$t("commitSession"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }
    this.loading = false
  }

  async editChapter(chapterDraft: ChapterSchema): Promise<void> {
    this.loading = true
    const response = await Chapter.edit(this.chapter.id, chapterDraft, this.authConfig)

    if (response.data) {
      this.clear()
      await this.$router.push(`/manga/${this.mangaId}/${response.data.id}`)
    } else {
      const notification = {
        color: "error",
        context: this.$t("editChapter"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }
    this.loading = false
  }

  mounted(): void {
    if (this.$route.query.id) {
      const sessionId = this.$route.query.id
      // Query params can be an array if multiple are provided
      if (typeof sessionId == "string") {
        this.getSession(sessionId)
      } else if (sessionId[0]) {
        this.getSession(sessionId[0])
      }
    } else if (!this.chapter) {
      this.createSession(this.mangaId, null)
    }
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
getSession: "Get upload session"
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
getSession: "Demande de session"
commitSession: "Confirmation de session"
groupAutocomplete: "Autocomplétion de groupe"
</i18n>
