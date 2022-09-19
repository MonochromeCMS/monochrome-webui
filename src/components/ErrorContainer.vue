<script setup lang="ts">
import type { ApiResponseFail } from '@/api/Base'

defineProps<{
  error: ApiResponseFail
}>()

const { t } = useI18n()
</script>

<template>
  <v-container class="fill-height">
    <v-row class="h-100">
      <v-col cols="12" sm="7" md="5" lg="4" xl="3" class="ma-auto">
        <v-sheet rounded="lg" class="pa-8 text-center">
          <h1 class="text-h1">
            {{ error.status }}
          </h1>
          <p class="text-subtitle-1">
            {{ error.error }}
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
homeLink: Return to main page
</i18n>

<i18n locale="fr" lang="yaml">
homeLink: 'Revenir vers l''accueil'
</i18n>
