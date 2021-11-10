<template>
  <v-dialog v-model="dialog" max-width="30rem">
    <template #activator="{ on, attrs }">
      <v-btn
        class="mx-2"
        width="3rem"
        color="error"
        v-bind="attrs"
        aria-label="Delete user"
        v-on="on"
      >
        <v-icon>{{ icons.mdiDelete }}</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5 background mb-2">{{ $t('warning') }}</v-card-title>
      <v-card-text class="body-1">
        <span class="font-weight-bold">{{ $t('warningBoldMessage') }}</span>
        {{ $t('warningMessage') }}
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="gray" text @click="dialog = false">{{ $t('cancel') }}</v-btn>
        <v-btn color="error" :loading="loading" @click="deleteUser(user.id)">{{
          $t('delete')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import User from '@/api/User';
import { mdiDelete } from '@mdi/js';
import type { AxiosRequestConfig } from 'axios';

@Component
export default class UserDeleteButton extends Vue {
  @Prop() readonly user!: any;

  @Prop(Boolean) readonly ownUser!: boolean;

  icons = {
    mdiDelete,
  };

  loading = false;

  dialog = false;

  @Emit('update')
  update(): boolean {
    return true;
  }

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig;
  }

  async deleteUser(userId: string): Promise<void> {
    this.loading = true;
    const response = await User.delete(userId, this.authConfig);

    if (response.data) {
      this.update();
      this.dialog = false;
      if (this.ownUser) {
        this.$store.commit('logout');
      }
    } else {
      const notification = {
        context: this.$t('deleteUser'),
        message: response.error ?? '',
        color: 'error',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
    if (response.status === 401) {
      this.$store.commit('logout');
    }
    this.loading = false;
  }
}
</script>

<i18n locale="en" lang="yaml">
warningMessage: 'Are you sure you want to delete this user?'
deleteUser: 'Delete user'
</i18n>

<i18n locale="en" lang="yaml">
warningMessage: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?'
deleteUser: "Suppression d'utilisateur"
</i18n>
