<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="10" lg="8" class="mx-auto">
        <user-form
          color="backgroundAlt"
          :own-user="true"
          :user="user"
          @close="goBack"
          @update="updateUser"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import type { UserResponse } from '@/api/User';
import UserForm from '@/components/UserForm.vue';
import UsersList from '@/components/UsersList.vue';

@Component({
  components: { UserForm, UsersList },
})
export default class About extends Vue {
  get user(): UserResponse {
    return this.$store.state.user;
  }

  get isConnected(): boolean {
    return this.$store.getters.isConnected;
  }

  updateUser(): void {
    this.$store.dispatch('getUserData');
  }

  goBack(): void {
    this.$router.go(-1);
  }

  mounted(): void {
    if (!this.isConnected) this.$router.replace('/');
  }
}
</script>
