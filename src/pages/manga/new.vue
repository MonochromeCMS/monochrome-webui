<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <v-container class="fill-height">
    <v-row class="h-100">
      <v-col cols="12" sm="10" md="8" lg="6" class="ma-auto">
        <v-card rounded="lg" color="backgroundAlt" flat>
          <v-card-title class="text-center lemon-milk">
            {{ t("createManga") }}
          </v-card-title>
          <v-card-text>
            <manga-form />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<i18n locale="en" lang="yaml">
createManga: Create manga
</i18n>

<i18n locale="fr" lang="yaml">
createManga: Création de manga
</i18n>

<route lang="yaml">
meta:
  needsAuth: true
</route>
