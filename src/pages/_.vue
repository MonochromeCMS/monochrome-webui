<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <v-container class="fill-height">
    <v-row class="h-100">
      <v-col cols="12" sm="6" md="4" lg="3" xl="2" class="ma-auto">
        <v-sheet class="pa-8 text-center">
          <h1 class="text-h1">
            404
          </h1>
          <p class="text-subtitle-1">
            {{ t("notFound") }}
          </p>
          <router-link class="text-decoration-none" to="/">
            {{ t("homeLink") }}
          </router-link>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<i18n locale="en" lang="yaml">
notFound: Not Found
homeLink: Return to main page
</i18n>

<i18n locale="fr" lang="yaml">
notFound: Page Non Trouvée
homeLink: 'Revenir vers l''accueil'
</i18n>
