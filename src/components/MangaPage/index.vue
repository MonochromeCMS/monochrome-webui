<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import type { MangaResponse } from '@/api/Manga'

const { t } = useI18n()
const notifications = useNotifications()

const searchQuery = useRouteQuery('q')
const searchString = computed(() => {
  if (typeof searchQuery.value === 'string')
    return searchQuery.value
  else if (searchQuery.value)
    return searchQuery.value[0] ?? ''
  else
    return ''
})
const search = debouncedRef(searchString, 1000)
const loading = ref(false)
const manga = ref([] as MangaResponse[])
const page = ref(1)
const total = ref(0)
const limit = 12

const pageAmount = computed(() => Math.ceil(total.value / limit))
const offset = computed(() => (page.value - 1) * limit)

async function getManga() {
  loading.value = true
  const response = await Manga.search(search.value, limit, offset.value)

  if (response.data !== null) {
    manga.value = response.data.results
    total.value = response.data.total
  }
  else {
    notifications.create('error', t('mangaPagination'), response.error)
  }
  loading.value = false
}

watch(search, () => page.value = 1)
watch(search, getManga)

watch(offset, getManga)

await getManga()
</script>

<template>
  <v-row>
    <v-col cols="12">
      <manga-page-search v-model="searchQuery" :loading="loading" />
    </v-col>
  </v-row>
  <v-row class="ma-0">
    <v-col v-if="manga.length === 0" cols="12" class="text-center">
      {{ t(search ? "noMangaFound" : "noManga") }}
    </v-col>
    <v-col v-for="item in manga" :key="item.id" cols="12" sm="6" md="4" lg="3" xl="2">
      <manga-page-card :manga="item" />
    </v-col>
  </v-row>
  <v-row v-if="pageAmount > 1">
    <v-pagination
      v-model="page"
      class="mx-auto pb-4"
      color="background text--primary"
      :length="pageAmount"
    />
  </v-row>
</template>
