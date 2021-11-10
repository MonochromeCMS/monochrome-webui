<template>
  <validation-observer ref="observer">
    <v-form @submit.prevent="submit">
      <!-- TITLE FIELD -->
      <validation-provider v-slot="{ errors }" :name="$t('title')" rules="required">
        <v-text-field
          v-model="title"
          :error-messages="errors"
          :label="$t('title')"
          required
          outlined
        />
      </validation-provider>
      <!-- DESC FIELD -->
      <validation-provider v-slot="{ errors }" :name="$t('description')" rules="required">
        <v-textarea
          v-model="description"
          :error-messages="errors"
          :label="$t('description')"
          required
          outlined
        />
      </validation-provider>
      <!-- AUTHOR FIELD -->
      <validation-provider v-slot="{ errors }" :name="$t('author')" rules="required">
        <v-text-field
          v-model="author"
          :error-messages="errors"
          :label="$t('author')"
          required
          outlined
        />
      </validation-provider>
      <!-- ARTIST FIELD -->
      <validation-provider v-slot="{ errors }" :name="$t('artist')" rules="required">
        <v-text-field
          v-model="artist"
          :error-messages="errors"
          :label="$t('artist')"
          required
          outlined
        />
      </validation-provider>
      <!-- YEAR FIELD -->
      <validation-provider
        v-slot="{ errors }"
        :name="$t('year')"
        :rules="{
          digits: 4,
        }"
      >
        <v-text-field
          v-model="year"
          :error-messages="errors"
          :label="$t('year')"
          required
          outlined
        />
      </validation-provider>
      <!-- STATUS FIELD -->
      <validation-provider v-slot="{ errors }" :name="$t('status')" rules="required">
        <v-select
          v-model="status"
          :items="statusItems"
          :error-messages="errors"
          :label="$t('status')"
          outlined
        />
      </validation-provider>
      <!-- COVER FIELD -->
      <validation-provider v-slot="{ errors }" :name="$t('cover')" :rules="manga ? '' : 'required'">
        <v-file-input
          v-model="cover"
          :error-messages="errors"
          accept="image/*"
          :label="$t('cover')"
        >
        </v-file-input>
      </validation-provider>
      <!-- PREVIEW -->
      <v-expansion-panels class="mb-4">
        <v-expansion-panel>
          <v-expansion-panel-header>{{ $t('preview') }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <manga-row :loading="false" :manga="params" :cover="url(cover) || ''" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <div class="text-center">
        <v-btn type="submit" block color="background" class="text--primary">
          {{ manga ? $t('editManga') : $t('createManga') }}
        </v-btn>
      </div>
    </v-form>
  </validation-observer>
</template>

<script lang="ts">
import type { AxiosRequestConfig } from 'axios';
import { extend, setInteractionMode, ValidationObserver, ValidationProvider } from 'vee-validate';
import { digits, required } from 'vee-validate/dist/rules';
import { Component, Prop, Vue } from 'vue-property-decorator';

import type { MangaResponse, MangaSchema, Status } from '@/api/Manga';
import Manga from '@/api/Manga';
import Media from '@/api/Media';
import MangaRow from '@/components/MangaRow.vue';

setInteractionMode('eager');

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
});
extend('digits', {
  ...digits,
  message: '{_field_} requires {length} digits ',
});

@Component({
  components: {
    MangaRow,
    ValidationProvider,
    ValidationObserver,
  },
})
export default class MangaForm extends Vue {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>;
  };

  @Prop() readonly manga!: MangaResponse | null;

  title = '';

  description = '';

  author = '';

  artist = '';

  year?: number | null = null;

  status: Status | null = null;

  cover: File | null = null;

  statusItems = [
    { value: 'ongoing', text: this.$t('ongoing') },
    { value: 'hiatus', text: this.$t('hiatus') },
    { value: 'completed', text: this.$t('completed') },
    { value: 'cancelled', text: this.$t('cancelled') },
  ];

  get params(): MangaSchema {
    return {
      title: this.title,
      description: this.description,
      author: this.author,
      artist: this.artist,
      year: this.year ?? undefined,
      status: this.status ?? 'ongoing',
    };
  }

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig;
  }

  url(blob: File | null): string | null {
    if (blob) {
      return blob ? URL.createObjectURL(blob) : null;
    } else {
      return this.manga ? Media.cover(this.manga.id, this.manga.version) : null;
    }
  }

  async submit(): Promise<void> {
    const valid = await this.$refs.observer.validate();
    if (valid) {
      if (this.manga) {
        await this.editManga(this.params, this.manga.id);
      } else {
        await this.createManga(this.params);
      }
    }
  }

  clear(): void {
    this.title = '';
    this.description = '';
    this.author = '';
    this.artist = '';
    this.year = null;
    this.status = null;
  }

  async createManga(params: MangaSchema): Promise<void> {
    const response = await Manga.create(params, this.authConfig);

    if (response.data) {
      await this.setCover(response.data.id, this.cover);
    } else {
      const notification = {
        context: this.$t('createManga'),
        message: response.error ?? '',
        color: 'error',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
    if (response.status === 401) {
      this.$store.commit('logout');
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
    } else {
      const notification = {
        context: this.$t('editManga'),
        message: response.error ?? '',
        color: 'error',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
    if (response.status === 401) {
      this.$store.commit('logout');
    }
  }

  async setCover(mangaId: string, cover: File | null): Promise<void> {
    if (!cover) {
      return;
    }

    const response = await Manga.setCover(mangaId, cover, this.authConfig);

    if (response.data) {
      await this.$router.push(`/manga/${mangaId}`);
    } else {
      const notification = {
        context: this.$t('setCover'),
        message: response.error ?? '',
        color: 'error',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
    if (response.status === 401) {
      this.$store.commit('logout');
    }
  }

  mounted(): void {
    if (this.manga) {
      this.title = this.manga.title;
      this.description = this.manga.description;
      this.author = this.manga.author;
      this.artist = this.manga.artist;
      this.year = this.manga.year;
      this.status = this.manga.status;
    }
  }
}
</script>

<i18n locale="en" lang="yaml">
title: 'Title'
description: 'Description'
author: 'Author'
artist: 'Artist'
year: 'Year of release'
status: 'Status'
cover: 'Cover'
preview: 'Preview'
editManga: 'Edit manga'
createManga: 'Create manga'
setCover: 'Set cover'
</i18n>

<i18n locale="fr" lang="yaml">
title: 'Titre'
description: 'Description'
author: 'Auteur'
artist: 'Artiste'
year: 'Année de parution'
status: 'Status'
cover: 'Couverture'
preview: 'Aperçu'
editManga: 'Modifier manga'
createManga: 'Créer manga'
setCover: 'Définir couverture'
</i18n>
