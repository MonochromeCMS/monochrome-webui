<script setup lang="ts">
import { mdiMagnify } from '@mdi/js'

const props = defineProps<{
  modelValue: string | string[] | null
  loading: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { t } = useI18n()

const search = useVModel(props, 'modelValue', emits)
</script>

<template>
  <v-text-field
    v-model="search"
    :label="t('search')"
    :loading="loading"
    :prepend-inner-icon="mdiMagnify"
    bg-color="background"
    variant="solo"
    hide-details
    clearable
    class="my-2 mx-4"
  />
</template>

<i18n locale="en" lang="yaml">
search: Search
  </i18n>

  <i18n locale="fr" lang="yaml">
search: Recherche
  </i18n>
