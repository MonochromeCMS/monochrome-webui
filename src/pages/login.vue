<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <v-container class="fill-height">
    <v-row class="h-100">
      <v-col cols="12" sm="6" md="4" lg="3" class="ma-auto">
        <v-card flat>
          <v-card-title class="text-center lemon-milk">
            {{ t("login") }}
          </v-card-title>
          <v-card-text>
            <login-form />
            <v-divider class="my-4" />
            <router-link
              to="/register"
              class="text-decoration-none subtitle-1 d-block text-center"
            >
              {{ t("registerLink") }}
            </router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<i18n locale="en" lang="yaml">
login: Login
registerLink: Create a new account
</i18n>

<i18n locale="fr" lang="yaml">
login: Connexion
registerLink: Créer un nouveau compte
</i18n>

<route lang="yaml">
meta:
  needsAuth: false
</route>
