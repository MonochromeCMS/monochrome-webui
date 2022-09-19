<script setup lang="ts">
const { t } = useI18n()
const auth = useAuth()

const canCreate = computed(() => auth.isConnected && Manga.canCreate(auth.role))
</script>

<template>
  <v-container class="fill-height">
    <v-row class="h-100">
      <v-col cols="12">
        <v-card color="backgroundAlt" flat>
          <v-card-title class="text-center lemon-milk">
            {{ t("manga") }}
          </v-card-title>
          <manga-page />
          <template v-if="canCreate">
            <v-divider />
            <v-card-actions>
              <v-btn block to="/manga/new">
                {{ t("addManga") }}
              </v-btn>
            </v-card-actions>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<i18n locale="en" lang="yaml">
addManga: Add a manga
manga: Manga
  </i18n>

  <i18n locale="fr" lang="yaml">
addManga: Ajouter un manga
manga: Manga
  </i18n>
