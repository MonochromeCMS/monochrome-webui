<script setup lang="ts">
import type { MangaResponse } from '@/api/Manga'

const { t } = useI18n()
const notifications = useNotifications()

const total = ref(0)
const limit = 5

const manga = ref([] as MangaResponse[])

interface Item {
  type?: 'divider' | 'card'
  inset?: boolean
  prependAvatar?: string
  title?: string
  subtitle?: string
  to?: string
}

const items = computed(() =>
  manga.value.reduce((acc, m) => {
    if (acc.length)
      acc.push({ type: 'divider', inset: true })

    acc.push({
      prependAvatar: Media.cover(m.id, m.version),
      title: m.title,
      subtitle: m.description,
      to: `/manga/${m.id}`,
    })

    return acc
  }, [] as Item[]),
)

async function getManga() {
  const response = await Manga.search(null, limit, 0)

  if (response.data) {
    manga.value = response.data.results
    total.value = response.data.total
  }
  else {
    notifications.create('error', t('latestManga'), response.error)
  }
}

await getManga()
</script>

<template>
  <v-card-title class="text-center lemon-milk pa-2">
    {{ t(total <= limit ? "manga" : "recentlyAdded") }}
  </v-card-title>
  <v-card-text>
    <v-row class="pt-0">
      <v-col>
        <v-list
          three-line
          color="backgroundAlt"
          :items="items"
          item-props
          lines="two"
        />
        <div v-if="manga.length === 0" class="text-center mb-2">
          {{ t("noManga") }}
        </div>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<i18n locale="en" lang="yaml">
latestManga: Latest manga
manga: Manga
recentlyAdded: Recently added
</i18n>

<i18n locale="fr" lang="yaml">
latestManga: Derniers mangas ajoutés
manga: Manga
recentlyAdded: Ajoutés récemment
</i18n>
