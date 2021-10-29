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
import { Vue, Component } from 'vue-property-decorator';
import UsersList from '@/components/UsersList.vue';
import UserForm from '@/components/UserForm.vue';
import type { UserResponse } from '@/api/User';

@Component({
  components: { UsersList, UserForm },
})
export default class About extends Vue {
  get user(): UserResponse {
    return this.$store.state.user;
  }

  get isConnected(): boolean {
    return this.$store.getters.isConnected;
  }

  notification(): void {
    const notification = {
      context: 'Register',
      message: 'Account created successfully',
      color: 'success',
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
