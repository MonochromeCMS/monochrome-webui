<script setup lang="ts">
import { marked } from 'marked'

const { t } = useI18n()
const settings = useSettings()

const aboutHTML = computed(() => {
  return marked(settings.about)
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col class="mx-auto" cols="12" md="10" lg="8" xl="6">
        <v-card color="backgroundAlt" flat>
          <template v-if="settings.about">
            <v-card-text>
              <div v-dompurify-html="aboutHTML" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <div class="text-caption text-secondary">
                {{ t('createdWith') }}
                <a
                  href="https://github.com/D34DPlayer/Monochrome"
                  class="text-decoration-none"
                  target="_blank"
                >
                  Monochrome</a>.
              </div>
            </v-card-actions>
          </template>
          <template v-else>
            <v-card-title class="text-center lemon-milk">
              {{ t("about") }}
            </v-card-title>
            <v-card-text class="text-body-1">
              <v-row>
                <v-col cols="12">
                  {{ t("createdWith") }}
                  <a
                    href="https://github.com/D34DPlayer/Monochrome"
                    class="text-decoration-none"
                    target="_blank"
                  >
                    Monochrome</a>.
                </v-col>
                <v-col cols="12">
                  {{ t("monochromeGoal") }}
                </v-col>
                <v-col cols="12">
                  {{ t("monochromeHow") }}
                  <a
                    href="https://github.com/D34DPlayer/Monochrome"
                    class="text-decoration-none"
                    target="_blank"
                  >
                    Github</a>.
                </v-col>
                <v-col cols="12" class="mb-2">
                  {{ t("creator") }}
                  <a href="https://www.d34d.one" class="text-decoration-none" target="_blank">
                    {{ t("here") }}</a>.
                </v-col>
              </v-row>
            </v-card-text>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<i18n locale="en" lang="yaml">
about: About us
createdWith: This website was created with
monochromeGoal: 'Monochrome''s goal is to provide a good quality manga CMS for anyone to host.'
monochromeHow: You can find how it works and how to set up your own version of Monochrome on
creator: 'And if you are interested, you can find more about its creator'
here: here
</i18n>

<i18n locale="fr" lang="yaml">
about: À propos de nous
createdWith: Ce site a été créé avec
monochromeGoal: 'L''objectif de Monochrome est de fournir un CMS de qualité, que n''importe qui puisse mettre en place.'
monochromeHow: Vous pouvez trouver comment Monochrome fonctionne et comment héberger votre propre version sur
creator: 'Et si vous êtes intéressés, vous pouvez trouver son créateur'
here: ici
</i18n>
