<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="10" md="8" lg="6" class="mx-auto">
        <v-card color="backgroundAlt" flat>
          <v-card-title class="justify-center lemon-milk">
            {{ t("customizeWebsite") }}
          </v-card-title>
          <v-card-text>
            <settings-form />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<i18n locale="en" lang="yaml">
customizeWebsite: Customize the website
</i18n>

<i18n locale="fr" lang="yaml">
customizeWebsite: Personnaliser le site
</i18n>

<route lang="yaml">
meta:
  needsAuth: true
</route>
