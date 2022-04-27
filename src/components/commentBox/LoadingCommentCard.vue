<template>
  <v-card class="ma-0 pa-3" flat>
    <div class="d-flex">
      <v-responsive width="2rem" height="2rem" class="mr-4 rounded-circle">
        <v-skeleton-loader type="image" />
      </v-responsive>
      <div style="width: 100%">
        <v-skeleton-loader type="text,text,text,text" />
      </div>
      <v-btn icon disabled>
        <v-icon>{{ icons.mdiReply }}</v-icon>
      </v-btn>
    </div>
    <div class="pt-2" style="width: 5rem; margin-left: auto">
      <v-skeleton-loader type="text" />
    </div>
  </v-card>
</template>

<script lang="ts">
import { mdiReply } from "@mdi/js"
import { Component, Vue } from "vue-property-decorator"

@Component
export default class LoadingCommentCard extends Vue {
  icons = { mdiReply }
}
</script>
