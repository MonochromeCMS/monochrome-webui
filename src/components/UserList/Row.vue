<script setup lang="ts">
import { Media } from '@/api/Media'
import type { UserResponse } from '@/api/User'

defineProps<{
  user: UserResponse
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const { t } = useI18n()
const auth = useAuth()
</script>

<template>
  <tr>
    <td class="capitalize">
      {{ t(`roles.${user.role}`) }}
    </td>
    <td>
      <div class="d-flex align-center justify-center">
        <v-img
          :src="Media.avatar(user.id, user.version)"
          :lazy-src="Media.defaultAvatar"
          width="1.5rem"
          height="1.5rem"
          class="rounded-circle user-avatar"
          style="flex: unset"
        />
        <div class="w-100 px-2 text-left">
          {{ user.username }}
        </div>
      </div>
    </td>
    <td class="hidden-sm-and-down ellipsis">
      {{ user.email }}
    </td>
    <td class="d-flex justify-center align-center">
      <user-list-edit
        :user="user"
        :own-user="auth.id === user.id"
        @update="emits('update')"
      />
      <user-list-delete
        :user-id="user.id"
        :own-user="auth.id === user.id"
        @update="emits('update')"
      />
    </td>
  </tr>
</template>

<style>
.user-avatar .v-img__img--preload {
  filter: none !important;
}
</style>
