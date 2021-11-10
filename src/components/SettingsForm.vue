<template>
  <validation-observer ref="observer">
    <v-form @submit.prevent="submit">
      <!-- TITLE FIELD -->
      <v-row>
        <v-col cols="12" md="6">
          <validation-provider v-slot="{ errors }" :name="$t('title1')">
            <v-text-field
              v-model="title1"
              :error-messages="errors"
              :label="$t('title1')"
              outlined
            ></v-text-field>
          </validation-provider>
        </v-col>
        <v-col cols="12" md="6">
          <validation-provider v-slot="{ errors }" :name="$t('title2')">
            <v-text-field
              v-model="title2"
              :error-messages="errors"
              :label="$t('title2')"
              outlined
            ></v-text-field>
          </validation-provider>
        </v-col>
      </v-row>
      <!-- ABOUT FIELD -->
      <validation-provider v-slot="{ errors }" :name="$t('aboutPage')">
        <v-textarea
          v-model="about"
          :error-messages="errors"
          :label="$t('aboutPage')"
          hide-details="auto"
          outlined
        ></v-textarea>
      </validation-provider>

      <div class="caption ma-3">
        <a href="https://www.markdownguide.org/basic-syntax" class="text-decoration-none">
          Markdown
        </a>
        {{ $t('markdownCaption') }}
      </div>

      <!-- PREVIEW -->
      <v-expansion-panels class="mb-4">
        <v-expansion-panel>
          <v-expansion-panel-header>{{ $t('preview') }}</v-expansion-panel-header>
          <v-expansion-panel-content class="text-center">
            <div v-html="markdownHTML" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <div class="text-center">
        <v-btn type="submit" block color="background" class="text--primary">{{
          $t('customize')
        }}</v-btn>
      </div>
    </v-form>
  </validation-observer>
</template>

<script lang="ts">
import type { AxiosRequestConfig } from 'axios';
import marked from 'marked';
import { setInteractionMode, ValidationObserver, ValidationProvider } from 'vee-validate';
import { Component, Vue, Watch } from 'vue-property-decorator';

import type { SettingsSchema } from '@/api/Settings';
import Settings from '@/api/Settings';

setInteractionMode('eager');

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
})
export default class SettingsForm extends Vue {
  title1?: string | null = null;

  title2?: string | null = null;

  about?: string | null = null;

  get params(): any {
    return {
      title1: this.title1 || null,
      title2: this.title2 || null,
      about: this.about || null,
    };
  }

  get markdownHTML() {
    return this.about ? marked(this.about) : '';
  }

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig;
  }

  get settings(): SettingsSchema {
    return this.$store.getters.settings;
  }

  async submit(): Promise<void> {
    //@ts-expect-error I can't define this $ref, so let's assume it works
    const valid = await this.$refs.observer.validate();
    if (valid) {
      await this.editSettings(this.params);
    }
  }

  async editSettings(params: SettingsSchema): Promise<void> {
    const response = await Settings.edit(params, this.authConfig);

    if (response.data) {
      this.$store.commit('setSettings', response.data);
      const notification = {
        context: this.$t('editSettings'),
        message: this.$t('editSuccess'),
        color: 'success',
      };
      await this.$store.dispatch('pushNotification', notification);
    } else {
      const notification = {
        context: this.$t('editSettings'),
        message: response.error ?? '',
        color: 'error',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
    if (response.status === 401) {
      this.$store.commit('logout');
    }
  }

  @Watch('settings')
  onSettingsUpdate(value: any): void {
    this.title1 = value.title1;
    this.title2 = value.title2;
    this.about = value.about;
  }

  mounted(): void {
    this.title1 = this.settings.title1;
    this.title2 = this.settings.title2;
    this.about = this.settings.about;
  }
}
</script>

<i18n locale="en" lang="yaml">
title1: 'Title (first part)'
title2: 'Title (second part)'
aboutPage: 'About page'
markdownCaption: '(or HTML) can be used to customize the About page.'
preview: 'Preview'
customize: 'Customize'
editSettings: 'Edit settings'
editSuccess: 'The settings have been updated'
</i18n>

<i18n locale="fr" lang="yaml">
title1: 'Titre (première partie)'
title2: 'Titre (deuxième partie)'
aboutPage: 'Page à propos'
markdownCaption: '(ou du HTML) peuvent être utilisés pour personnaliser la page à propos.'
preview: 'Aperçu'
customize: 'Personnaliser'
editSettings: 'Modifier les paramètres'
editSuccess: 'Les paramètres ont été mis à jour'
</i18n>
