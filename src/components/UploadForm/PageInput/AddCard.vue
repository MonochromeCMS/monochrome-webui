<script setup lang="ts">
import { mdiPlus } from '@mdi/js'

defineProps<{
  loading: boolean
  progress: number
}>()

const emits = defineEmits<{
  (e: 'fileUpload', value: InputEvent): void
}>()

function onFileChange(ev: Event) {
  emits('fileUpload', ev as unknown as InputEvent)
}

const fileInput = ref<HTMLInputElement>()

function openFileInput() {
  fileInput.value?.click()
}
</script>

<template>
  <v-card color="background" :disabled="loading" @click="openFileInput()">
    <v-responsive :aspect-ratio="4 / 5">
      <div class="d-flex h-100">
        <v-progress-circular v-if="loading" :indeterminate="progress === 100" :value="progress" class="ma-auto d-block" />
        <v-icon v-else :icon="mdiPlus" size="x-large" class="ma-auto d-block" />
      </div>
    </v-responsive>

    <input ref="fileInput" type="file" multiple class="d-none" @input="onFileChange">
  </v-card>
</template>
