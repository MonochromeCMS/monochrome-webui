<script setup lang="ts">
import { mdiPencil } from '@mdi/js'

import { Media } from '@/api/Media'
import type { UserResponse } from '@/api/User'

const props = defineProps<{
  user: UserResponse
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()

const fileInput = ref<HTMLInputElement>()
const loading = ref(false)

function avatarClick() {
  fileInput.value?.click()
}

async function updateFile(ev: any) {
  if (!ev.target)
    return
  await uploadAvatar(ev.target.files[0])
  ev.target.value = null
}

async function uploadAvatar(file: File) {
  loading.value = true

  const response = await User.uploadAvatar(props.user.id, file, auth.config)

  if (response.data)
    emits('update')
  else
    notifications.create('error', t('avatarUpload'), response.error)

  loading.value = false
}
</script>

<template>
  <div class="avatar-container">
    <v-img
      :src="Media.avatar(user.id, user.version)"
      :lazy-src="Media.defaultAvatar"
      aspect-ratio="1:1"
      width="9rem"
      class="rounded-circle ma-1 user-avatar"
    />
    <v-btn :loading="loading" class="edit-button" icon @click="avatarClick()">
      <v-icon :icon="mdiPencil" />
    </v-btn>
    <input ref="fileInput" type="file" class="d-none" @input="updateFile">
  </div>
</template>

<style>
.user-avatar .v-img__img--preload {
  filter: none !important;
}

.avatar-container {
  position: relative;
}
.edit-button {
  position: absolute;
  top: 0.5rem;
  right: 0;
}
</style>
