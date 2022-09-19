<script setup lang="ts">
import Draggable from 'vuedraggable'

import naturalCompare from 'natural-compare-lite'
import type { UploadSessionResponse, UploadedBlobResponse } from '@/api/Upload'

const props = defineProps<{
  modelValue: string[]
  session: UploadSessionResponse
  disabled: boolean
  webtoon: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
  (e: 'update'): void
}>()

const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()

const pageOrder = useVModel(props, 'modelValue', emits)

const pages = ref([] as UploadedBlobResponse[])
const loading = ref(false)
const deleting = ref(false)
const progress = ref(0)

watch(pages, (pages) => {
  pageOrder.value = pages.map(page => page.id)
})

async function updateFile(ev: InputEvent) {
  const files = (ev.target as HTMLInputElement).files
  if (files)
    await uploadFiles(files)
}

function handleProgress(progressEvent: ProgressEvent) {
  progress.value = (progressEvent.loaded * 100) / progressEvent.total
}

async function uploadFiles(files: FileList) {
  loading.value = true
  progress.value = 0

  const response = await Upload.upload(props.session.id, files, auth.config, handleProgress)
  if (response.data !== null)
    pages.value.push(...response.data)
  else
    notifications.create('error', t('fileUpload'), response.error)

  loading.value = false
}

async function deletePage(id: string) {
  deleting.value = true
  const response = await Upload.deleteBlob(props.session.id, id, auth.config)
  if (response.data !== null) {
    const index = pages.value.findIndex(page => page.id === id)
    pages.value.splice(index, 1)
  }
  else {
    notifications.create('error', t('deletePage'), response.error)
  }
  deleting.value = false
}

async function deleteAllPages() {
  deleting.value = true
  const response = await Upload.deleteAllBlob(props.session.id, auth.config)
  if (response.data !== null)
    pages.value = []
  else
    notifications.create('error', t('deleteAllPages'), response.error)

  deleting.value = false
}

async function slice() {
  loading.value = true
  const response = await Upload.slice(props.session.id, pageOrder.value, auth.config)

  if (response.data !== null)
    pages.value = response.data
  else
    notifications.create('error', t('slicing'), response.error)

  loading.value = false
}

function quickSort() {
  pages.value.sort((a, b) => naturalCompare(a.name, b.name))
}

watchEffect(() => pages.value = props.session.blobs)
</script>

<template>
  <v-container>
    <h2 class="text-h5">
      {{ t("pages") }}
    </h2>
    <Draggable v-model="pages" item-key="id" class="drag-pages">
      <template #item="{ element }">
        <v-col cols="6" sm="4" md="3" xl="2">
          <upload-form-page-input-card :page="element" :disabled="disabled || deleting" @delete="deletePage(element.id)" />
        </v-col>
      </template>
      <template #footer>
        <v-col cols="6" sm="4" md="3" xl="2">
          <upload-form-page-input-add-card
            :loading="loading || disabled"
            :progress="progress"
            @file-upload="updateFile"
          />
        </v-col>
      </template>
    </Draggable>
    <div class="btn-flex">
      <v-btn v-if="webtoon" :disabled="loading" variant="text" @click="slice">
        {{ t("slice") }}
      </v-btn>
      <v-btn text color="background" @click="quickSort">
        {{ t("quickSort") }}
      </v-btn>
      <v-btn text color="error" @click="deleteAllPages()">
        {{ t("deleteAll") }}
      </v-btn>
    </div>
    <div>
      <ul>
        <li>{{ t("uploadNotes1") }}</li>
        <li>{{ t("uploadNotes2") }}</li>
        <li>{{ t("uploadNotes3") }}</li>
      </ul>
    </div>
  </v-container>
</template>

<style lang="scss">
.drag-pages {
  display: flex;
  flex-wrap: wrap;
}

.btn-flex {
  display: flex;
  margin-bottom: 1rem;

  .v-btn--variant-elevated {
    margin-right: 1rem;
  }
}
</style>

<i18n locale="en" lang="yaml">
pages: Pages
slice: Slice the parts optimally
quickSort: Quick sort
deleteAll: Delete all
uploadNotes1: 'Supported image formats are JPEG, PNG, BMP and WebP.'
uploadNotes2: Compressed files are also supported. They must not contain any folders.
uploadNotes3: You can upload multiple images at the same time.
slicing: Slicing
fileUpload: File upload
deletePage: Delete page
deleteAllPages: Delete all pages
</i18n>

<i18n locale="fr" lang="yaml">
pages: Pages
slice: Découpe les parties de façon optimale
quickSort: Tri rapide
deleteAll: Tout supprimer
uploadNotes1: 'Les formats d''image pris en charge sont JPEG, PNG, BMP et WebP.'
uploadNotes2: Les fichiers compressés sont aussi pris en charge. Ils ne doivent contenir aucun dossier.
uploadNotes3: Vous pouvez ajouter plusieurs fichiers en même temps.
slicing: Découpage
fileUpload: Ajout de fichier
deletePage: Supprimer la page
deleteAllPages: Supprimer toutes les pages
</i18n>
