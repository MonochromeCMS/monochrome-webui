<template>
  <v-row>
    <v-col cols="12" sm="10" md="8" lg="6" class="mx-auto mb-3">
      <v-card color="backgroundAlt">
        <v-card-title class="lemon-milk">{{ $t("comments") }}</v-card-title>
        <v-divider class="mx-4" />
        <v-card-text>
          <comment-list ref="list" :chapter-id="chapterId" :reply-to.sync="replyTo" />
          <v-divider class="my-3" />
          <comment-input
            ref="input"
            :chapter-id="chapterId"
            :reply-to.sync="replyTo"
            @send="sendComment"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { AxiosRequestConfig } from "axios"
import { Component, Prop, Ref, Vue } from "vue-property-decorator"

import type { CommentSchema, DetailedCommentResponse } from "@/api/Comment"
import Comment from "@/api/Comment"
import type CommentInput from "@/components/commentBox/CommentInput.vue"
import type CommentList from "@/components/commentBox/CommentList.vue"

@Component
export default class CommentBox extends Vue {
  @Ref() readonly input!: CommentInput

  @Ref() readonly list!: CommentList

  @Prop(String) readonly chapterId!: string

  replyTo: DetailedCommentResponse | null = null

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig
  }

  async sendComment(params: CommentSchema): Promise<void> {
    const response = await Comment.create(params, this.authConfig)

    if (response.data) {
      this.input.success()
      this.list.refresh()
    } else {
      const notification = {
        color: "error",
        context: this.$t("addComment"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }
  }
}
</script>

<i18n locale="en" lang="yaml">
comments: "Comments"
addComment: "Add comment"
</i18n>

<i18n locale="fr" lang="yaml">
comments: "Commentaires"
addComment: "Ajouter commentaire"
</i18n>
