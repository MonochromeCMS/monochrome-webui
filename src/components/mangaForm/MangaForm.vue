<template>
  <validation-observer ref="observer">
    <manga-fields ref="fields" v-model="cover" :manga="manga" @submit="submit" />
  </validation-observer>
</template>

<script lang="ts">
import type { AxiosRequestConfig } from 'axios';
import type { ValidationObserver } from 'vee-validate';
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

import type { MangaResponse, MangaSchema } from '@/api/Manga';
import Manga from '@/api/Manga';

import type MangaFields from './MangaFields.vue';

@Component
export default class MangaForm extends Vue {
  @Ref() readonly observer!: InstanceType<typeof ValidationObserver>;

  @Ref() readonly fields!: MangaFields;

  @Prop() readonly manga!: MangaResponse | null;

  cover: File | null = null;

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig;
  }

  async submit(params: MangaSchema): Promise<void> {
    const valid = await this.observer.validate();
    if (valid) {
      if (this.manga) {
        await this.editManga(params, this.manga.id);
      } else {
        await this.createManga(params);
      }
    }
  }

  clear(): void {
    this.fields.clear();
    this.observer.reset();
  }

  async createManga(params: MangaSchema): Promise<void> {
    const response = await Manga.create(params, this.authConfig);

    if (response.data) {
      if (this.cover) {
        await this.setCover(response.data.id, this.cover);
      } else {
        await this.$router.push(`/manga/${response.data.id}`);
      }
      this.clear();
    } else {
      const notification = {
        color: 'error',
        context: this.$t('createManga'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
  }

  async editManga(params: MangaSchema, id: string): Promise<void> {
    const response = await Manga.edit(id, params, this.authConfig);

    if (response.data) {
      if (this.cover) {
        await this.setCover(id, this.cover);
      } else {
        await this.$router.push(`/manga/${id}`);
      }
      this.clear();
    } else {
      const notification = {
        color: 'error',
        context: this.$t('editManga'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
  }

  async setCover(mangaId: string, cover: File): Promise<void> {
    const response = await Manga.setCover(mangaId, cover, this.authConfig);

    if (response.data) {
      this.cover = null;
      await this.$router.push(`/manga/${mangaId}`);
    } else {
      const notification = {
        color: 'error',
        context: this.$t('setCover'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
  }
}
</script>
