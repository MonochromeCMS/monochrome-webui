<template>
  <v-col cols="12" sm="6" class="relative">
    <v-img
      :src="avatar(user.id, user.version)"
      :lazy-src="defAvatar"
      aspect-ratio="1:1"
      class="rounded-circle ma-1"
    />
    <v-btn :loading="loading" large class="edit-button" icon @click="avatarClick">
      <v-icon large>{{ icons.mdiPencil }}</v-icon>
    </v-btn>
    <input ref="fileInput" type="file" @input="updateFile" style="display: none" />
  </v-col>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { mdiPencil } from '@mdi/js';
import Media from '@/api/Media';
import User from '@/api/User';
import type { AxiosRequestConfig } from 'axios';

@Component
export default class AvatarInput extends Vue {
  $refs!: {
    fileInput: HTMLInputElement;
  };

  @Prop() readonly user!: any;

  icons = {
    mdiPencil,
  };

  loading = false;

  defAvatar = Media.defaultAvatar;

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig;
  }

  avatarClick(): void {
    this.$refs.fileInput.click();
  }

  async updateFile(ev: any): Promise<void> {
    if (!ev.target) {
      return;
    }

    await this.uploadAvatar(ev.target.files[0]);
    ev.target.value = null;
  }

  async uploadAvatar(file: File): Promise<void> {
    this.loading = true;

    const response = await User.uploadAvatar(this.user.id, file, this.authConfig);

    if (response.data) {
      this.update();
    } else {
      const notification = {
        context: this.$t('avatarUpload'),
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

  avatar(userId: string, version: number): string {
    return Media.avatar(userId, version);
  }

  @Emit('update')
  update(): boolean {
    return true;
  }
}
</script>

<i18n locale="en" lang="yaml">
avatarUpload: 'Avatar upload'
</i18n>

<i18n locale="fr" lang="yaml">
avatarUpload: "Mise à jour d'avatar"
</i18n>
