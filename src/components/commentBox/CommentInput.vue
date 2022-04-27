<template>
  <div>
    <v-card v-if="replyToSync" color="background" rounded="lg" style="position: relative">
      <v-card-title class="text-h6">Replying to {{ replyToSync.author.username }}</v-card-title>
      <v-card-text class="text-body-1">
        {{ replyToSync.content }}
      </v-card-text>
      <v-btn icon tile class="close-icon" @click="replyToSync = null">
        <v-icon>{{ icons.mdiClose }}</v-icon>
      </v-btn>
    </v-card>
    <v-textarea
      v-if="canCreate"
      v-model="content"
      class="pa-3 pt-5"
      hide-details="auto"
      auto-grow
      no-resize
      :success-messages="successMsg"
      rows="3"
      :label="$t('inputLabel')"
      :append-outer-icon="icons.mdiSend"
      @click:append-outer="sendComment"
      @focus="successMsg = ''"
    />
    <div v-else class="background pa-3 text-center">
      <router-link to="/login" class="text-decoration-none">{{ $t("login") }}</router-link>
      {{ $t("toPostComment") }}
    </div>
  </div>
</template>

<script lang="ts">
import { mdiClose, mdiSend } from "@mdi/js"
import { Component, Prop, PropSync, Vue } from "vue-property-decorator"

import type { CommentSchema, DetailedCommentResponse } from "@/api/Comment"
import Comment from "@/api/Comment"

@Component
export default class CommentInput extends Vue {
  @Prop(String) readonly chapterId!: string

  @PropSync("replyTo") readonly replyToSync!: DetailedCommentResponse | null

  icons = { mdiClose, mdiSend }

  content = ""

  successMsg = ""

  get canCreate(): boolean {
    const userRole = this.$store.getters.userRole
    return Comment.canCreate(userRole)
  }

  get params(): CommentSchema {
    return {
      chapterId: this.chapterId,
      content: this.content,
      replyTo: this.replyToSync?.id ?? undefined,
    }
  }

  public success(): void {
    this.content = ""
    this.successMsg = this.$tc("successComment")
  }

  sendComment(): void {
    if (this.content) {
      this.$emit("send", this.params)
    }
  }
}
</script>

<style lang="scss">
.close-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>

<i18n locale="en" lang="yaml">
login: "Log in"
toPostComment: "to add a comment."
successComment: "Comment added"
inputLabel: "Add a comment"
</i18n>

<i18n locale="fr" lang="yaml">
login: "Connecte-toi"
toPostComment: "pour ajouter un commentaire."
successComment: "Commentaire ajouté"
inputLabel: "Ajouter un commentaire"
</i18n>
