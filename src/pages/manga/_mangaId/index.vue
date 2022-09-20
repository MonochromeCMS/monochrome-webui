<script setup lang="ts">
import type { MangaResponse } from '@/api/Manga'
import type { ApiResponseFail } from '@/api/Base'

const { t } = useI18n()
const auth = useAuth()
const error = ref(null as ApiResponseFail | null)

const mangaId = useRouteSingleParam('mangaId')
const manga = ref(null as MangaResponse | null)
const firstChapter = ref('')

const canUpload = computed(() => auth.isConnected && Manga.canCreate(auth.role))
const canEdit = computed(() => auth.isConnected && manga.value ? Manga.canEdit(manga.value, auth.id, auth.role) : false)
const cover = computed(() => manga.value ? Media.cover(manga.value.id, manga.value.version) : '')

async function getManga() {
  const response = await Manga.get(mangaId.value)

  if (response.data !== null)
    manga.value = response.data
  else
    error.value = response
}

watchEffect(getManga)
</script>

<template>
  <error-container v-if="error" :error="error" />
  <v-container v-else class="fill-height">
    <v-row class="h-100">
      <v-col cols="12">
        <v-card color="backgroundAlt" :loading="!manga" :disabled="!manga" flat>
          <template v-if="manga">
            <manga-row :manga="manga" :cover="cover" class=" ma-4">
              <div class="action-flex">
                <v-btn
                  v-if="firstChapter"
                  :to="`/chapters/${firstChapter}`"
                  color="background"
                >
                  {{ t('startReading') }}
                </v-btn>
                <v-btn v-if="canUpload" :to="`/manga/${mangaId.value}/upload`" color="success">
                  {{ t('addChapter') }}
                </v-btn>
                <v-btn v-if="canEdit" :to="`/manga/${mangaId.value}/edit`" color="warning">
                  {{ t('editManga') }}
                </v-btn>
                <manga-delete-button v-if="canEdit" :manga-id="mangaId.value" />
              </div>
            </manga-row>

            <manga-chapters v-model:first-chapter="firstChapter" :manga-id="mangaId.value" />
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss">
  .action-flex {
    display: flex;
    flex-wrap: wrap;
    .v-btn {
      margin-top: .5rem;
      margin-right: .5rem;
    }
  }
</style>

<i18n locale="en" lang="yaml">
startReading: Start reading
addChapter: Add a chapter
editManga: Edit manga
deleteManga: Delete manga
warningMessage: Are you sure you want to delete this manga?
  </i18n>

  <i18n locale="fr" lang="yaml">
startReading: Commencer à lire
addChapter: Ajouter un chapitre
editManga: Modifier le manga
deleteManga: Supprimer le manga
warningMessage: Êtes-vous sûr de vouloir supprimer ce manga?
  </i18n>
