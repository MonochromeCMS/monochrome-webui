<script setup lang="ts">
import { mdiPencil } from '@mdi/js'
import type { UserResponse } from '@/api/User'

defineProps<{
  user: UserResponse
  ownUser: boolean
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const dialog = ref(false)
</script>

<template>
  <v-dialog v-model="dialog" max-width="40rem">
    <template #activator="{ props }">
      <v-btn
        color="warning"
        variant="text"
        v-bind="props"
        aria-label="Edit user"
        class="mx-2"
      >
        <v-icon :icon="mdiPencil" />
      </v-btn>
    </template>
    <user-form
      :user="user"
      :own-user="ownUser"
      @close="dialog = false"
      @update="emits('update')"
    />
  </v-dialog>
</template>
