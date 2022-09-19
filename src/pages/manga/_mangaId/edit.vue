<script setup lang="ts">
import type { ApiResponseFail } from '@/api/Base'
import type { MangaResponse } from '@/api/Manga'

const router = useRouter()
const { t } = useI18n()
const auth = useAuth()
const error = ref(null as ApiResponseFail | null)

const mangaId = useRouteSingleParam('mangaId')

const manga = ref(null as MangaResponse | null)

async function getManga(mangaId: string) {
  const response = await Manga.get(mangaId)

  if (response.data !== null)
    manga.value = response.data
  else
    error.value = response
}

watchEffect(() => getManga(mangaId.value))

onMounted(() => {
  if (!auth.isConnected)
    router.replace('/')
})
</script>

<template>
  <error-container v-if="error" :error="error" />
  <v-container v-else class="fill-height">
    <v-row class="h-100">
      <v-col cols="12" sm="10" md="8" lg="6" class="ma-auto">
        <v-card color="backgroundAlt" :loading="!manga" flat>
          <v-card-title class="text-center lemon-milk">
            {{ t("editManga") }}
          </v-card-title>
          <v-card-text>
            <manga-form v-if="manga" :manga="manga" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<i18n locale="en" lang="yaml">
getManga: Get manga
editManga: Edit manga
</i18n>

<i18n locale="fr" lang="yaml">
getManga: Chargement du manga
editManga: Modification du manga
</i18n>

<route lang="yaml">
meta:
  needsAuth: true
</route>
