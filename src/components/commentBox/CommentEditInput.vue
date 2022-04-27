<template>
  <div>
    <v-textarea
      v-model="content"
      class="background pa-3 pt-5 rounded-lg"
      hide-details="auto"
      auto-grow
      no-resize
      rows="1"
      :label="$t('inputLabel')"
      :append-icon="icons.mdiClose"
      :append-outer-icon="icons.mdiCheck"
      @click:append="close"
      @click:append-outer="editComment"
    />
  </div>
</template>

<script lang="ts">
import { mdiCheck, mdiClose } from "@mdi/js"
import type { AxiosRequestConfig } from "axios"
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator"

import type { CommentEditSchema, CommentResponse } from "@/api/Comment"
import Comment from "@/api/Comment"

@Component
export default class CommentEditInput extends Vue {
  @Prop() readonly comment!: CommentResponse

  icons = { mdiCheck, mdiClose }

  content = "..."

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig
  }

  get params(): CommentEditSchema {
    return {
      content: this.content,
    }
  }

  @Emit("close")
  close(): boolean {
    return true
  }

  @Emit("update")
  update(): boolean {
    return true
  }

  async editComment(): Promise<void> {
    const response = await Comment.edit(this.comment.id, this.params, this.authConfig)

    if (response.data) {
      this.close()
      this.update()
    } else {
      const notification = {
        color: "error",
        context: this.$t("commentEdit"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }
  }

  @Watch("comment")
  onCommentChange() {
    this.content = this.comment.content
  }

  mounted() {
    this.content = this.comment.content
  }
}
</script>

<style lang="scss"></style>

<i18n locale="en" lang="yaml">
commentEdit: "Edit comment"
inputLabel: "Edit the comment"
</i18n>

<i18n locale="fr" lang="yaml">
commentEdit: "Modifier le commentaire"
inputLabel: "Modifie le comment"
</i18n>
