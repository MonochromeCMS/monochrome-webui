<script setup lang="ts">
import { mdiMagnify } from '@mdi/js'
import type { UserFilters } from '@/api/User'

const props = defineProps<{
  filters: UserFilters
}>()

const emits = defineEmits<{
  (e: 'update:filters'): void
  (e: 'update'): void
}>()

const filters = useVModel(props, 'filters', emits)
const { t } = useI18n()

const upper = (t: string) => (t ? t[0].toUpperCase() + t.slice(1) : t)

const roleItems = computed(() => [
  { title: '---', value: null },
  { title: upper(t('roles.admin')), value: 'admin' },
  { title: upper(t('roles.uploader')), value: 'uploader' },
  { title: upper(t('roles.user')), value: 'user' },
])
</script>

<template>
  <v-row align="center" class="ma-0 mb-2 pa-1 bg-background rounded-lg">
    <v-col cols="12" sm="4">
      <v-text-field
        v-model="filters.username"
        :label="t('username')"
        density="compact"
        variant="outlined"
        clearable
        hide-details
        :prepend-inner-icon="mdiMagnify"
        @click:prepend-inner="emits('update')"
      />
    </v-col>
    <v-col cols="12" sm="4">
      <v-select
        v-model="filters.role"
        :items="roleItems"
        :label="t('role')"
        density="compact"
        variant="outlined"
        hide-details
      />
    </v-col>
    <v-col cols="12" sm="4">
      <v-btn class="float-right" @click="emits('update')">
        {{ t("filter") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<i18n locale="en" lang="yaml">
username: Username
role: Role
filter: Filter
</i18n>

<i18n locale="fr" lang="yaml">
username: 'Nom d''utilisateur'
role: Rôle
filter: Filtrer
</i18n>
