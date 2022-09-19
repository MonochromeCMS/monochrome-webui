<script setup lang="ts">
import { mdiPlus } from '@mdi/js'

import type { UserResponse } from '@/api/User'

defineProps<{
  users: UserResponse[]
  showAdd: boolean
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const { t } = useI18n()

const headers = computed(() => [
  {
    title: t('role'),
  },
  {
    title: t('username'),
  },
  {
    class: 'hidden-sm-and-down',
    title: t('email'),
  },
  {
    title: t('actions'),
  },
])
const addDialog = ref(false)
</script>

<template>
  <v-table class="bg-background rounded">
    <thead>
      <tr>
        <th
          v-for="h in headers"
          :key="h.title"
          class="text-center"
          :class="h.class"
        >
          {{ h.title }}
        </th>
      </tr>
    </thead>
    <tbody class="text-center">
      <user-list-row
        v-for="user in users"
        :key="user.id"
        :user="user"
        @update="emits('update')"
      />
      <tr>
        <td colspan="4" class="add-td">
          <v-dialog v-model="addDialog" width="75vw" max-width="40rem">
            <template #activator="{ props }">
              <v-btn block variant="text" color="primary" v-bind="props">
                <v-icon :icon="mdiPlus" />
              </v-btn>
            </template>
            <user-form
              :own-user="false"
              @close="addDialog = false"
              @update="emits('update')"
            />
          </v-dialog>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style lang="scss">
.add-td {
  padding: 0 !important;

  .v-btn {
    height: 48px;
  }
}
</style>

<i18n locale="en" lang="yaml">
role: Role
username: Username
email: Email
actions: Actions
</i18n>

<i18n locale="fr" lang="yaml">
role: Rôle
username: 'Nom d''utilisateur'
email: Email
actions: Actions
</i18n>
