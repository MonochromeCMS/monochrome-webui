<script setup lang="ts">
import { digits, required } from '@/composables/formRules'
import type { MangaResponse, MangaSchema } from '@/api/Manga'
import { Media } from '@/api/Media'

const props = defineProps<{
  manga?: MangaResponse
}>()

const { t } = useI18n()

const params = reactive({
  title: '',
  description: '',
  author: '',
  artist: '',
  year: null,
  status: 'ongoing',
} as MangaSchema)

const coverModel = ref([] as File[])
const cover = computed(() =>
  coverModel.value && coverModel.value.length ? coverModel.value[0] : undefined,
)
const coverInputUrl = useObjectUrl(cover)
const coverUrl = computed(() => {
  if (coverInputUrl.value)
    return coverInputUrl.value
  else if (props.manga)
    return Media.cover(props.manga.id, props.manga.version)
  else
    return ''
})

const upper = (t: string) => (t ? t[0].toUpperCase() + t.slice(1) : t)

const statusItems = computed(() => [
  { title: upper(t('status.ongoing')), value: 'ongoing' },
  { title: upper(t('status.hiatus')), value: 'hiatus' },
  { title: upper(t('status.completed')), value: 'completed' },
  { title: upper(t('status.cancelled')), value: 'cancelled' },
])

function set(manga?: MangaSchema) {
  if (manga) {
    params.title = manga.title
    params.description = manga.description
    params.author = manga.author
    params.artist = manga.artist
    params.year = manga.year
    params.status = manga.status
  }
}

watchEffect(() => set(props.manga))

defineExpose({ params, cover })
</script>

<template>
  <v-row>
    <!-- TITLE FIELD -->
    <v-col cols="12">
      <v-text-field
        v-model="params.title"
        :label="t('title')"
        :rules="[required]"
        variant="outlined"
        hide-details="auto"
        required
      />
    </v-col>
    <!-- DESC FIELD -->
    <v-col cols="12">
      <v-textarea
        v-model="params.description"
        :label="t('description')"
        :rules="[required]"
        variant="outlined"
        hide-details="auto"
        auto-grow
        required
      />
    </v-col>
    <!-- AUTHOR FIELD -->
    <v-col cols="12">
      <v-text-field
        v-model="params.author"
        :label="t('author')"
        :rules="[required]"
        variant="outlined"
        hide-details="auto"
        required
      />
    </v-col>
    <!-- ARTIST FIELD -->
    <v-col cols="12">
      <v-text-field
        v-model="params.artist"
        :label="t('artist')"
        :rules="[required]"
        variant="outlined"
        hide-details="auto"
        required
      />
    </v-col>
    <!-- YEAR FIELD -->
    <v-col cols="12">
      <v-text-field
        v-model="params.year"
        :label="t('year')"
        :rules="[required, digits(4)]"
        variant="outlined"
        hide-details="auto"
        type="number"
        required
      />
    </v-col>
    <!-- STATUS FIELD -->
    <v-col cols="12">
      <v-select
        v-model="params.status"
        :items="statusItems"
        :rules="[required]"
        :label="t('status')"
        variant="outlined"
        hide-details="auto"
        required
      />
    </v-col>
    <!-- COVER FIELD -->
    <v-col cols="12">
      <v-file-input
        v-model="coverModel"
        :label="t('cover')"
        :rules="manga ? [] : [required]"
        accept="image/*"
        variant="outlined"
        hide-details="auto"
        :required="!manga"
      />
    </v-col>
    <v-col cols="12">
      <v-expansion-panels>
        <v-expansion-panel bg-color="background">
          <v-expansion-panel-title>{{ t("preview") }}</v-expansion-panel-title>
          <v-expansion-panel-text>
            <manga-row :manga="params" :cover="coverUrl" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
    <v-col cols="12">
      <v-btn block color="background" type="submit">
        {{ manga ? t("editManga") : t("createManga") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<style>
.v-file-input .v-field {
  height: 56px;
}
</style>

<i18n locale="en" lang="yaml">
title: Title
description: Description
author: Author
artist: Artist
year: Year of release
status: Status
cover: Cover
preview: Preview
editManga: Edit manga
createManga: Create manga
</i18n>

<i18n locale="fr" lang="yaml">
title: Titre
description: Description
author: Auteur
artist: Artiste
year: Année de parution
status: Status
cover: Couverture
preview: Aperçu
editManga: Modifier manga
createManga: Créer manga
</i18n>
