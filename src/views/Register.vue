<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="10" lg="8" class="mx-auto">
        <user-form
          color="backgroundAlt"
          :own-user="false"
          :register="true"
          @close="goToLogin"
          @update="notification"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import type { UserResponse } from '@/api/User';

@Component
export default class About extends Vue {
  get user(): UserResponse {
    return this.$store.state.user;
  }

  get isConnected(): boolean {
    return this.$store.getters.isConnected;
  }

  notification(): void {
    const notification = {
      color: 'success',
      context: this.$t('register'),
      message: this.$t('registerSuccess'),
    };
    this.$store.dispatch('pushNotification', notification);
  }

  goToLogin(): void {
    this.$router.push('/login');
  }

  mounted(): void {
    if (this.isConnected) this.$router.replace('/');
  }
}
</script>

<i18n locale="en" lang="yaml">
register: 'Register'
registerSuccess: 'Account created successfully'
</i18n>

<i18n locale="fr" lang="yaml">
register: 'Inscription'
registerSuccess: 'Compte créé avec succès'
</i18n>
