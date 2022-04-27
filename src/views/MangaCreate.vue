<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="10" md="8" lg="6" class="mx-auto">
        <v-card rounded="lg" color="backgroundAlt" elevation="0" class="pa-4">
          <v-card-title class="justify-center lemon-milk">{{ $t("createManga") }}</v-card-title>
          <v-card-text>
            <manga-form :manga="null" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

import Manga from "@/api/Manga"
import type { Role } from "@/api/User"

@Component
export default class MangaCreate extends Vue {
  get userRole(): Role {
    return this.$store.getters.userRole
  }

  get canCreate(): boolean {
    return this.$store.getters.isConnected && Manga.canCreate(this.userRole)
  }

  mounted(): void {
    if (!this.canCreate) this.$router.replace("/")
  }
}
</script>

<i18n locale="en" lang="yaml">
createManga: "Create manga"
</i18n>

<i18n locale="fr" lang="yaml">
createManga: "Création de manga"
</i18n>
