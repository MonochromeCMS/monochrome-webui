<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="10" md="8" lg="6" class="mx-auto">
        <v-card rounded="lg" color="backgroundAlt" elevation="0" class="pa-4">
          <v-card-title class="justify-center lemon-milk">{{
            $t('customizeWebsite')
          }}</v-card-title>
          <v-card-text>
            <settings-form />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import SettingsAPI from '@/api/Settings';
import type { Role } from '@/api/User';
import SettingsForm from '@/components/SettingsForm.vue';

@Component({
  components: { SettingsForm },
})
export default class Settings extends Vue {
  get isConnected(): boolean {
    return this.$store.getters.isConnected;
  }

  get userRole(): Role {
    return this.$store.getters.userRole;
  }

  mounted(): void {
    if (!this.isConnected || !SettingsAPI.canEdit(this.userRole)) this.$router.replace('/');
  }
}
</script>

<i18n locale="en" lang="yaml">
customizeWebsite: 'Customize the website'
</i18n>

<i18n locale="fr" lang="yaml">
customizeWebsite: 'Personnaliser le site'
</i18n>
