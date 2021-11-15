<template>
  <v-col cols="12" sm="6" class="relative">
    <v-img
      :src="avatar(user.id, user.version)"
      :lazy-src="defAvatar"
      aspect-ratio="1:1"
      class="rounded-circle ma-1"
    />
    <v-btn
      :loading="loading"
      :disabled="disabled"
      large
      class="edit-button"
      icon
      @click="avatarClick"
    >
      <v-icon large>{{ icons.mdiPencil }}</v-icon>
    </v-btn>
    <input ref="fileInput" type="file" style="display: none" @input="updateFile" />
  </v-col>
</template>

<script lang="ts">
import { mdiPencil } from '@mdi/js';
import type { AxiosRequestConfig } from 'axios';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';

import Media from '@/api/Media';
import type { UserResponse } from '@/api/User';
import User from '@/api/User';

@Component
export default class AvatarInput extends Vue {
  @Ref() fileInput!: HTMLInputElement;

  @Prop({ default: false, type: Boolean }) readonly disabled!: boolean;

  @Prop() readonly user!: UserResponse;

  icons = {
    mdiPencil,
  };

  loading = false;

  defAvatar = Media.defaultAvatar;

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig;
  }

  avatarClick(): void {
    this.fileInput.click();
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
        color: 'error',
        context: this.$t('avatarUpload'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
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

<style lang="scss">
.relative {
  position: relative;
}
.edit-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
</style>

<i18n locale="en" lang="yaml">
avatarUpload: 'Avatar upload'
</i18n>

<i18n locale="fr" lang="yaml">
avatarUpload: "Mise à jour d'avatar"
</i18n>
