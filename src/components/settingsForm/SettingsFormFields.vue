<template>
  <v-form @submit.prevent="submit">
    <!-- TITLE FIELD -->
    <v-row>
      <v-col cols="12" md="6">
        <validation-provider v-slot="{ errors }" :name="$t('title1')">
          <v-text-field v-model="title1" :error-messages="errors" :label="$t('title1')" outlined />
        </validation-provider>
      </v-col>
      <v-col cols="12" md="6">
        <validation-provider v-slot="{ errors }" :name="$t('title2')">
          <v-text-field v-model="title2" :error-messages="errors" :label="$t('title2')" outlined />
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
      />
    </validation-provider>

    <div class="caption ma-3">
      <a href="https://www.markdownguide.org/basic-syntax" class="text-decoration-none">
        Markdown
      </a>
      {{ $t("markdownCaption") }}
    </div>

    <!-- PREVIEW -->
    <v-expansion-panels class="mb-4">
      <v-expansion-panel>
        <v-expansion-panel-header>{{ $t("preview") }}</v-expansion-panel-header>
        <v-expansion-panel-content class="text-center">
          <div v-dompurify-html="markdownHTML" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <div class="text-center">
      <v-btn type="submit" block color="background" :disabled="disabled" class="text--primary">
        {{ $t("customize") }}
      </v-btn>
    </div>
  </v-form>
</template>

<script lang="ts">
import marked from "marked"
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator"

import type { SettingsSchema } from "@/api/Settings"

@Component
export default class SettingsFormFields extends Vue {
  @Prop(Boolean) readonly disabled!: boolean

  title1?: string | null = null

  title2?: string | null = null

  about?: string | null = null

  get params(): SettingsSchema {
    return {
      about: this.about || undefined,
      title1: this.title1 || undefined,
      title2: this.title2 || undefined,
    }
  }

  get markdownHTML() {
    return this.about ? marked(this.about) : ""
  }

  get settings(): SettingsSchema {
    return this.$store.getters.settings
  }

  set(settings: SettingsSchema) {
    this.title1 = settings.title1
    this.title2 = settings.title2
    this.about = settings.about
  }

  @Emit("submit")
  submit(): SettingsSchema {
    return this.params
  }

  @Watch("settings")
  onSettingsUpdate(value: SettingsSchema): void {
    this.set(value)
  }

  mounted(): void {
    this.set(this.settings)
  }
}
</script>

<i18n locale="en" lang="yaml">
title1: "Title (first part)"
title2: "Title (second part)"
aboutPage: "About page"
markdownCaption: "(or HTML) can be used to customize the About page."
preview: "Preview"
customize: "Customize"
editSettings: "Edit settings"
editSuccess: "The settings have been updated"
</i18n>

<i18n locale="fr" lang="yaml">
title1: "Titre (première partie)"
title2: "Titre (deuxième partie)"
aboutPage: "Page à propos"
markdownCaption: "(ou du HTML) peuvent être utilisés pour personnaliser la page à propos."
preview: "Aperçu"
customize: "Personnaliser"
editSettings: "Modifier les paramètres"
editSuccess: "Les paramètres ont été mis à jour"
</i18n>
