<script setup lang="ts">
import type { MangaResponse } from '@/api/Manga'
import { Media } from '@/api/Media'

const { t } = useI18n()
const notifications = useNotifications()

const model = ref(0)

const height = 400
const amount = 3

const manga = ref([] as MangaResponse[])

async function getManga() {
  const response = await Manga.search(null, amount, 0)

  if (response.data !== null)
    manga.value = response.data.results
  else
    await notifications.create('error', t('latestManga'), response.error)
}

onMounted(getManga)
</script>

<template>
  <v-carousel
    v-model="model"
    :show-arrows="false"
    :height="height"
    class="rounded-lg"
    cycle
  >
    <v-carousel-item v-for="m in manga" :key="m.id">
      <parallax
        :height="height"
        :src="Media.cover(m.id, m.version)"
      >
        <router-link
          :to="`/manga/${m.id}`"
          class="row-column parallax-gradient"
        >
          <div class="text-h5 text-sm-h4 text-md-h3 text-lg-h2 px-4 pb-2">
            {{ m.title }}
          </div>
          <div
            class="text-subtitle-2 text-md-subtitle-1 text-justify px-4 pt-2 pb-16"
          >
            {{ m.description }}
          </div>
        </router-link>
      </parallax>
    </v-carousel-item>
  </v-carousel>
</template>

<style lang="scss">
.parallax-gradient {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    background: linear-gradient(
      to right,
      rgba(var(--v-theme-background), 0.7) 0%,
      rgba(var(--v-theme-background), 0.4) 50%,
      rgba(var(--v-theme-background), 0.7) 100%
    );
    height: 100%;
    width: 100%;
    z-index: 1;
  }
}

.row-column {
  display: flex;
  flex-direction: column;
  justify-content: end;

  height: 100%;
  margin: 0;

  text-decoration: none;
  color: var(--v-theme-primary);
  div {
    z-index: 2;
  }
}
</style>

<i18n locale="en" lang="yaml">
latestManga: Latest manga
</i18n>

<i18n locale="fr" lang="yaml">
latestManga: Derniers mangas ajoutés
</i18n>
