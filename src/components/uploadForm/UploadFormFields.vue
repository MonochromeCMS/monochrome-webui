<template>
  <v-form @submit.prevent="submit">
    <v-row class="mb-3">
      <!-- VOLUME FIELD -->
      <v-col cols="12" sm="6" md="4" class="pa-3 pb-0">
        <validation-provider v-slot="{ errors }" :name="$t('volumeNumber')" rules="numeric">
          <v-text-field
            v-model="volume"
            type="number"
            :error-messages="errors"
            :label="$t('volumeNumber')"
            required
            hide-details="auto"
            outlined
          />
        </validation-provider>
      </v-col>
      <!-- NUMBER FIELD -->
      <v-col cols="12" sm="6" md="4" class="pa-3 pb-0">
        <validation-provider
          v-slot="{ errors }"
          :name="$t('chapterNumber')"
          :rules="{ required: true, regex: /^[0-9.]+$/ }"
        >
          <v-text-field
            v-model="number"
            :error-messages="errors"
            :label="$t('chapterNumber')"
            required
            hide-details="auto"
            outlined
          />
        </validation-provider>
      </v-col>
      <!-- GROUP FIELD -->
      <v-col cols="12" md="4" class="pa-3 pb-0">
        <validation-provider v-slot="{ errors }" :name="$t('scanGroup')" rules="required">
          <v-combobox
            v-model="scanGroup"
            :items="groupAutocomplete"
            :error-messages="errors"
            :label="$t('scanGroup')"
            outlined
            hide-details="auto"
          />
        </validation-provider>
      </v-col>
    </v-row>
    <!-- NAME FIELD -->
    <validation-provider v-slot="{ errors }" :name="$t('chapterName')">
      <v-text-field
        v-model="name"
        :error-messages="errors"
        :label="$t('chapterName')"
        hide-details="auto"
        outlined
      />
    </validation-provider>

    <!-- NAME FIELD -->
    <validation-provider v-slot="{ errors }" name="Webtoon">
      <v-checkbox
        v-model="webtoon"
        :error-messages="errors"
        :label="$t('webtoonDescription')"
        hide-details="auto"
      />
    </validation-provider>

    <v-divider class="my-3" />

    <v-btn v-if="chapter && !session" color="info" @click="createSession()">
      {{ $t('editPages') }}
    </v-btn>

    <page-input
      v-if="session"
      v-model="pageOrder"
      :session="session"
      :disabled="disabled"
      :webtoon="webtoon"
    />

    <div class="text-center mt-4">
      <v-btn :loading="disabled" type="submit" block color="background" class="text--primary">
        {{ chapter ? $t('editChapter') : $t('uploadChapter') }}
      </v-btn>
    </div>
  </v-form>
</template>

<script lang="ts">
import { ValidationProvider } from 'vee-validate';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

import Autocomplete from '@/api/Autocomplete';
import type { ChapterResponse, ChapterSchema } from '@/api/Chapter';
import type { UploadSessionResponse } from '@/api/Upload';

import PageInput from './pageInput/PageInput.vue';

export interface UploadSubmitEvent {
  chapterDraft: ChapterSchema;
  pageOrder: string[];
}

@Component({
  components: { PageInput, ValidationProvider },
})
export default class UploadFormFields extends Vue {
  @Prop(String) readonly mangaId!: string;

  @Prop(Boolean) readonly disabled!: boolean;

  @Prop() readonly session!: UploadSessionResponse | null;

  @Prop() readonly chapter!: ChapterResponse | null;

  groupAutocomplete: string[] = [];

  name = '';

  volume?: number | null = null;

  number?: number | null = null;

  webtoon = false;

  pageOrder: string[] = [];

  scanGroup = 'no group';

  get chapterDraft(): ChapterSchema {
    return {
      name: this.name,
      number: this.number ?? 0,
      scanGroup: this.scanGroup,
      volume: this.volume ?? undefined,
      webtoon: this.webtoon,
    };
  }

  @Emit('session')
  createSession(): boolean {
    return true;
  }

  @Emit('submit')
  submit(): UploadSubmitEvent {
    return { chapterDraft: this.chapterDraft, pageOrder: this.pageOrder };
  }

  public clear(): void {
    this.name = '';
    this.number = undefined;
    this.volume = null;
    this.webtoon = false;
    this.scanGroup = 'no group';
  }

  async autocomplete(): Promise<void> {
    const response = await Autocomplete.groups();

    if (response.data) {
      this.groupAutocomplete = response.data;
    } else {
      const notification = {
        color: 'error',
        context: this.$t('groupAutocomplete'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
  }

  mounted(): void {
    if (this.chapter) {
      this.name = this.chapter.name;
      this.number = this.chapter.number;
      this.volume = this.chapter.volume;
      this.webtoon = this.chapter.webtoon;
      this.scanGroup = this.chapter.scanGroup;
    }
    this.autocomplete();
  }
}
</script>

<i18n locale="en" lang="yaml">
volumeNumber: 'Volume number'
chapterNumber: 'Chapter number'
scanGroup: 'Scan group'
chapterName: 'Chapter name'
webtoonDescription: 'This chapter is a webtoon (the webtoon reader will be used)'
editPages: 'Edit pages'
editChapter: 'Edit chapter'
uploadChapter: 'Upload chapter'
createSession: 'Create upload session'
commitSession: 'Commit upload session'
groupAutocomplete: 'Group autocomplete'
</i18n>

<i18n locale="fr" lang="yaml">
volumeNumber: 'Numéro de volume'
chapterNumber: 'Numéro de chapitre'
scanGroup: 'Nom du groupe'
chapterName: 'Nom du chapitre'
webtoonDescription: 'Ce chapitre est un webtoon (le lecteur de webtoon sera utilisé)'
editPages: 'Modifier les pages'
editChapter: 'Modifier le chapitre'
uploadChapter: 'Ajouter un chapitre'
createSession: 'Création de session'
commitSession: 'Confirmation de session'
groupAutocomplete: 'Autocomplétion de groupe'
</i18n>
