<script setup lang="ts">
const { t } = useI18n()
const auth = useAuth()

onMounted(() => {
  auth.logout()
})
</script>

<template>
  <v-container class="fill-height">
    <v-row class="h-100">
      <v-col cols="12" sm="6" md="4" lg="3" xl="2" class="ma-auto">
        <v-sheet class="pa-8 text-center">
          <h1 class="text-h4">
            {{ t("logout") }}
          </h1>
          <p class="text-subtitle-1">
            {{ t("loggingOut") }}
          </p>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<i18n locale="en" lang="yaml">
logout: Logout
loggingOut: Logging out...
</i18n>

<i18n locale="en" lang="yaml">
logout: Déconnexion
loggingOut: Déconnexion en cours...
</i18n>

<route lang="yaml">
meta:
  needsAuth: true
</route>
