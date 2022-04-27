<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4" class="mx-auto">
        <v-card rounded="lg" color="backgroundAlt" elevation="0" class="pa-4">
          <v-card-title class="justify-center lemon-milk">{{ $t("login") }}</v-card-title>
          <v-card-text>
            <login-form />
            <v-divider class="my-4" />
            <router-link to="/register" class="text-decoration-none subtitle-1 d-block text-center">
              {{ $t("registerLink") }}
            </router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

@Component
export default class Login extends Vue {
  get isConnected(): boolean {
    return this.$store.getters.isConnected
  }

  mounted(): void {
    if (this.isConnected) this.$router.replace("/")
  }
}
</script>

<i18n locale="en" lang="yaml">
login: "Login"
registerLink: "Create a new account"
</i18n>

<i18n locale="fr" lang="yaml">
login: "Connexion"
registerLink: "Créer un nouveau compte"
</i18n>
