<template>
  <v-container>
    <h2 class="text-h4 mt-0 mb-3">{{ $t('pages') }}</h2>
    <draggable v-model="pages" class="drag-pages">
      <template v-for="(item, index) in pages">
        <v-col :key="item.id" cols="6" sm="4" md="3" xl="2">
          <page-input-card
            :page="item"
            :disabled="deleting || disabled"
            @delete="deletePage(index, item.id)"
          />
        </v-col>
      </template>
      <v-col cols="6" sm="4" md="3" xl="2">
        <page-input-add-card
          :loading="loading || disabled"
          :progress="progress"
          @fileUpload="updateFile"
        />
      </v-col>
    </draggable>
    <v-btn v-if="webtoon" :disabled="loading" text @click="slice">{{ $t('slice') }}</v-btn>
    <v-btn text @click="quickSort">{{ $t('quickSort') }}</v-btn>
    <v-btn text color="error" @click="deletePages">{{ $t('deleteAll') }}</v-btn>
    <div>
      <ul>
        <li>{{ $t('uploadNotes1') }}</li>
        <li>{{ $t('uploadNotes2') }}</li>
        <li>{{ $t('uploadNotes3') }}</li>
      </ul>
    </div>
  </v-container>
</template>

<script lang="ts">
import type { AxiosRequestConfig } from 'axios';
import naturalCompare from 'natural-compare-lite';
import { Component, Prop, VModel, Vue, Watch } from 'vue-property-decorator';
import draggable from 'vuedraggable';

import type { UploadedBlobResponse, UploadSessionResponse } from '@/api/Upload';
import Upload from '@/api/Upload';

import PageInputAddCard from './PageInputAddCard.vue';
import PageInputCard from './PageInputCard.vue';

@Component({
  components: { PageInputAddCard, PageInputCard, draggable },
})
export default class PageInput extends Vue {
  @Prop() readonly session!: UploadSessionResponse;

  @Prop({ default: false, type: Boolean }) readonly disabled!: boolean;

  @Prop(Boolean) readonly webtoon!: boolean;

  @VModel() pageOrder!: string[];

  pages: UploadedBlobResponse[] = [];

  loading = false;

  deleting = false;

  progress = 0;

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig;
  }

  mounted(): void {
    this.pages = this.session.blobs;
  }

  @Watch('pages')
  onPagesChange(value: UploadedBlobResponse[]): void {
    this.pageOrder = value.map((el) => el.id);
  }

  handleProgress(progressEvent: any): void {
    this.progress = (100 * progressEvent.loaded) / progressEvent.total;
  }

  async updateFile(ev: any): Promise<void> {
    if (!ev.target) {
      return;
    }

    await this.uploadFiles(ev.target.files);
    ev.target.value = null;
  }

  async slice(): Promise<void> {
    this.loading = true;

    const response = await Upload.slice(this.session.id, this.pageOrder, this.authConfig);

    if (response.data) {
      this.pages = response.data;
    } else {
      const notification = {
        color: 'error',
        context: this.$t('slicing'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
    }

    this.loading = false;
  }

  async uploadFiles(files: File[]): Promise<void> {
    this.loading = true;
    this.progress = 0;

    const response = await Upload.upload(this.session.id, files, this.authConfig, (ev) =>
      this.handleProgress(ev),
    );

    if (response.data) {
      this.pages.push(...response.data);
    } else {
      const notification = {
        color: 'error',
        context: this.$t('fileUpload'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
    }

    this.loading = false;
  }

  async deletePage(index: number, id: string): Promise<void> {
    this.deleting = true;

    const response = await Upload.deleteBlob(this.session.id, id, this.authConfig);

    if (response.data || response.status === 404) {
      this.pages = this.pages.slice(0, index).concat(this.pages.slice(index + 1));
    } else {
      const notification = {
        color: 'error',
        context: this.$t('deletePage'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
    }

    this.deleting = false;
  }

  async deletePages(): Promise<void> {
    this.deleting = true;

    const response = await Upload.deleteAllBlob(this.session.id, this.authConfig);

    if (response.data) {
      this.pages = [];
    } else {
      const notification = {
        color: 'error',
        context: this.$t('deleteAllPages'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
    }

    this.deleting = false;
  }

  quickSort(): void {
    this.pages = this.pages.slice().sort((a, b) => naturalCompare(a.name, b.name));
  }
}
</script>

<style lang="scss">
.drag-pages {
  display: flex;
  flex-wrap: wrap;
}
</style>

<i18n locale="en" lang="yaml">
pages: 'Pages'
slice: 'Slice the parts optimally'
quickSort: 'Quick sort'
deleteAll: 'Delete all'
uploadNotes1: 'Supported image formats are JPEG, PNG, BMP and WebP.'
uploadNotes2: 'Compressed files are also supported. They must not contain any folders.'
uploadNotes3: 'You can upload multiple images at the same time.'
slicing: 'Slicing'
fileUpload: 'File upload'
deletePage: 'Delete page'
deleteAllPages: 'Delete all pages'
</i18n>

<i18n locale="fr" lang="yaml">
pages: 'Pages'
slice: 'Découpe les parties de façon optimale'
quickSort: 'Tri rapide'
deleteAll: 'Tout supprimer'
uploadNotes1: "Les formats d'image pris en charge sont JPEG, PNG, BMP et WebP."
uploadNotes2: 'Les fichiers compressés sont aussi pris en charge. Ils ne doivent contenir aucun dossier.'
uploadNotes3: 'Vous pouvez ajouter plusieurs fichiers en même temps.'
slicing: 'Découpage'
fileUpload: 'Ajout de fichier'
deletePage: 'Supprimer la page'
deleteAllPages: 'Supprimer toutes les pages'
</i18n>
