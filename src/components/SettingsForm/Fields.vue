<script setup lang="ts">
import { marked } from 'marked'

import type { SettingsSchema } from '@/api/Settings'

const { t } = useI18n()
const settings = useSettings()

const params = reactive({
  about: '',
  title1: '',
  title2: '',
} as SettingsSchema)

const aboutHTML = computed(() => (params.about ? marked(params.about) : ''))

function set(settings: SettingsSchema) {
  params.about = settings.about
  params.title1 = settings.title1
  params.title2 = settings.title2
}

watchEffect(() => set(settings))

defineExpose({ params })
</script>

<template>
  <!-- TITLE FIELD -->
  <v-row>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="params.title1"
        :label="t('title1')"
        variant="outlined"
        hide-details
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="params.title2"
        :label="t('title2')"
        variant="outlined"
        hide-details
      />
    </v-col>
    <!-- ABOUT FIELD -->
    <v-col cols="12" class="pb-0">
      <v-textarea
        v-model="params.about"
        :label="t('aboutPage')"
        variant="outlined"
        hide-details
      />
    </v-col>

    <v-col cols="12" class="text-caption pa-0 ma-3">
      <a
        href="https://www.markdownguide.org/basic-syntax"
        class="text-decoration-none"
      >
        Markdown
      </a>
      {{ t("markdownCaption") }}
    </v-col>

    <!-- PREVIEW -->
    <v-col cols="12">
      <v-expansion-panels color="background">
        <v-expansion-panel bg-color="background">
          <v-expansion-panel-title>{{ t("preview") }}</v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-dompurify-html="aboutHTML" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
    <v-col cols="12" class="text-center">
      <v-btn type="submit" block color="background" class="text-primary">
        {{ t("customize") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<i18n locale="en" lang="yaml">
title1: Title (first part)
title2: Title (second part)
aboutPage: About page
markdownCaption: (or HTML) can be used to customize the About page.
preview: Preview
customize: Customize
editSettings: Edit settings
editSuccess: The settings have been updated
</i18n>

<i18n locale="fr" lang="yaml">
title1: Titre (première partie)
title2: Titre (deuxième partie)
aboutPage: Page à propos
markdownCaption: (ou du HTML) peuvent être utilisés pour personnaliser la page à propos.
preview: Aperçu
customize: Personnaliser
editSettings: Modifier les paramètres
editSuccess: Les paramètres ont été mis à jour
</i18n>
