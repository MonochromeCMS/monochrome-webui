<script setup lang="ts">
import type { DetailedChapterResponse } from '@/api/Chapter'

const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()

const limit = 10

const chapters = ref([] as DetailedChapterResponse[])
const page = ref(1)
const total = ref(0)
const offset = computed(() => (page.value - 1) * limit)
const pageAmount = computed(() => Math.ceil(total.value / limit))

async function getChapters() {
  const response = await Chapter.latest(limit, offset.value, auth.config)

  if (response.data !== null) {
    chapters.value = response.data.results
    total.value = response.data.total
  }
  else {
    notifications.create('error', t('latestChapters'), response.error)
  }
}

watch(offset, getChapters)

await getChapters()
</script>

<template>
  <v-card-title class="text-center lemon-milk">
    {{ t("latestChapters") }}
  </v-card-title>
  <v-card-text>
    <v-row class="ma-0">
      <v-col
        v-if="chapters.length === 0"
        cols="12"
        class="text-center text-body-1"
      >
        {{ t("noChapters") }}
      </v-col>
      <v-col
        v-for="chapter in chapters"
        :key="chapter.id"
        cols="12"
        sm="6"
        class="pa-2"
      >
        <latest-chapters-card
          :chapter="chapter"
          @update="getChapters()"
        />
      </v-col>
    </v-row>
    <v-row v-if="pageAmount > 1">
      <v-pagination
        v-model="page"
        class="mx-auto py-4"
        color="background text-primary"
        :length="pageAmount"
      />
    </v-row>
  </v-card-text>
</template>

<i18n locale="en" lang="yaml">
latestChapters: Latest chapters
</i18n>

<i18n locale="fr" lang="yaml">
latestChapters: Derniers chapitres
</i18n>
