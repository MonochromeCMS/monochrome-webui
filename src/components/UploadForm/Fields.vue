<script setup lang="ts">
import type { ChapterResponse, ChapterSchema } from '@/api/Chapter'
import type { UploadSessionResponse } from '@/api/Upload'

import { numeric, regex, required } from '@/composables/formRules'

const props = defineProps<{
  disabled: boolean
  mangaId: string
  chapter?: ChapterResponse
  session?: UploadSessionResponse | null
}>()

const { t } = useI18n()
const notifications = useNotifications()

const emits = defineEmits<{
  (e: 'session'): void
}>()

const groupAutocomplete = ref(['no group'])
const chapterDraft = reactive({
  name: '',
  number: 0,
  scanGroup: 'no group',
  volume: undefined,
  webtoon: false,
} as ChapterSchema)

const pageOrder = ref([] as string[])

async function autocomplete() {
  const response = await Autocomplete.groups()

  if (response.data !== null)
    groupAutocomplete.value = response.data
  else
    notifications.create('error', t('groupAutocomplete'), response.error)
}

function set(chapter?: ChapterResponse) {
  if (chapter) {
    chapterDraft.name = chapter.name
    chapterDraft.number = chapter.number
    chapterDraft.volume = chapter.volume
    chapterDraft.webtoon = chapter.webtoon
    chapterDraft.scanGroup = chapter.scanGroup
  }
}

watchEffect(() => set(props.chapter))

onMounted(autocomplete)

defineExpose({ chapterDraft, pageOrder })
</script>

<template>
  <v-row>
    <!-- VOLUME FIELD -->
    <v-col cols="12" sm="6" md="4">
      <v-text-field
        v-model="chapterDraft.volume"
        :rules="[numeric]"
        :label="t('volumeNumber')"
        hide-details="auto"
        variant="outlined"
        min="1"
      />
    </v-col>
    <!-- NUMBER FIELD -->
    <v-col cols="12" sm="6" md="4">
      <v-text-field
        v-model="chapterDraft.number"
        :rules="[required, regex(/^[0-9.]+$/)]"
        :label="t('chapterNumber')"
        hide-details="auto"
        variant="outlined"
        required
      />
    </v-col>
    <!-- GROUP FIELD -->
    <v-col cols="12" md="4">
      <v-combobox v-model="chapterDraft.scanGroup" :items="groupAutocomplete" :rules="[required]" :label="t('scanGroup')" hide-details="auto" variant="outlined" />
    </v-col>
    <!-- NAME FIELD -->
    <v-col cols="12">
      <v-text-field v-model="chapterDraft.name" :label="t('chapterName')" hide-details="auto" variant="outlined" />
    </v-col>
    <!-- WEBTOON FIELD -->
    <v-col cols="12" class="pt-0">
      <v-checkbox v-model="chapterDraft.webtoon" :label="t('webtoonDescription')" hide-details="auto" />
    </v-col>
  </v-row>

  <v-divider />
  <v-btn v-if="!session" color="primary" class="my-4" @click="emits('session')">
    {{ t("editPages") }}
  </v-btn>

  <upload-form-page-input v-else v-model="pageOrder" :session="session" :disabled="disabled" :webtoon="chapterDraft.webtoon" />

  <v-divider />

  <v-btn :loading="disabled" :disabled="disabled" type="submit" color="background" block class="mt-4">
    {{ chapter ? t("editChapter") : t("uploadChapter") }}
  </v-btn>
</template>

<i18n locale="en" lang="yaml">
volumeNumber: Volume number
chapterNumber: Chapter number
scanGroup: Scan group
chapterName: Chapter name
webtoonDescription: This chapter is a webtoon (the webtoon reader will be used)
editPages: Edit pages
groupAutocomplete: Group autocomplete
editChapter: Edit chapter
uploadChapter: Upload chapter
</i18n>

<i18n locale="fr" lang="yaml">
volumeNumber: Numéro de volume
chapterNumber: Numéro de chapitre
scanGroup: Nom du groupe
chapterName: Nom du chapitre
webtoonDescription: Ce chapitre est un webtoon (le lecteur de webtoon sera utilisé)
editPages: Modifier les pages
groupAutocomplete: Autocomplétion de groupe
editChapter: Modifier le chapitre
uploadChapter: Ajouter un chapitre
</i18n>
