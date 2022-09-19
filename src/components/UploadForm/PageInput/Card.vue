<script setup lang="ts">
import { mdiClose } from '@mdi/js'
import type { UploadedBlobResponse } from '@/api/Upload'

import { Media } from '@/api/Media'

defineProps<{
  page: UploadedBlobResponse
  disabled: boolean
}>()

const emits = defineEmits<{
  (e: 'delete'): void
}>()
</script>

<template>
  <v-card color="background" class="page-card">
    <v-img :src="Media.blob(page.id)" :aspect-ratio="4 / 5" position="relative" cover>
      <v-btn
        :disabled="disabled"
        size="small"
        icon
        class="background text--primary page-close"
        @click="emits('delete')"
      >
        <v-icon>{{ mdiClose }}</v-icon>
      </v-btn>
      <v-chip class="page-name" variant="flat" color="background">
        {{ page.name }}
      </v-chip>
    </v-img>
  </v-card>
</template>

<style scoped>
  .page-card {
    cursor: grab;
  }
  .page-name {
    position: absolute;
    bottom: 0.1rem;
    left: 0.1rem;
  }
  .page-close {
    position: absolute;
    right: 0.1rem;
    top: 0.1rem;
  }
  </style>
