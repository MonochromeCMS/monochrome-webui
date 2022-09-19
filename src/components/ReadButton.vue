<script setup lang="ts">
import { mdiEye, mdiEyeOff } from '@mdi/js'

defineProps<{ read: boolean }>()
const emits = defineEmits<{
  (e: 'input', value: boolean): void
}>()

const { t } = useI18n()
</script>

<template>
  <v-btn
    icon
    variant="text"
    class="read-btn"
    size="small"
    @click.prevent="emits('input', !read)"
  >
    <v-icon :icon="read ? mdiEyeOff : mdiEye" />
    <v-tooltip activator="parent" location="bottom">
      <span>{{ t(read ? "unread" : "read") }}</span>
    </v-tooltip>
  </v-btn>
</template>

<i18n locale="en" lang="yaml">
read: Mark chapter as read
unread: Mark chapter as unread
</i18n>

<i18n locale="fr" lang="yaml">
read: Marquer le chapitre comme lu
unread: Marquer le chapitre comme non-lu
</i18n>
