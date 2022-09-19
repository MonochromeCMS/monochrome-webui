<script setup lang="ts">
import { mdiDelete } from '@mdi/js'

const props = defineProps<{
  userId: string
  ownUser: boolean
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()

const dialog = ref(false)
const loading = ref(false)

async function deleteUser(userId: string) {
  loading.value = true

  const response = await User.delete(userId, auth.config)

  if (response.data !== null) {
    emits('update')
    dialog.value = false
    if (props.ownUser)
      auth.logout()
  }
  else {
    notifications.create('error', t('deleteUser'), response.error)
  }

  loading.value = false
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="30rem">
    <template #activator="{ props: activatorProps }">
      <v-btn
        class="mx-2"
        width="3rem"
        color="error"
        variant="text"
        aria-label="Delete user"
        v-bind="activatorProps"
      >
        <v-icon :icon="mdiDelete" />
      </v-btn>
    </template>
    <v-card :loading="loading" :disabled="loading">
      <v-card-title class="text-h5 bg-background pa-4">
        {{ t("warning") }}
      </v-card-title>
      <v-card-text class="body-1">
        <v-alert v-if="ownUser" color="warning" class="mb-3">
          {{ t("ownUser") }}
        </v-alert>
        <span class="font-weight-bold">{{ t("warningBoldMessage") }}</span>
        {{ t("warningMessage") }}
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="gray" text @click="dialog = false">
          {{ t("cancel") }}
        </v-btn>
        <v-btn color="error" @click="deleteUser(userId)">
          {{ t("delete") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<i18n locale="en" lang="yaml">
warningMessage: Are you sure you want to delete this user?
deleteUser: Delete user
ownUser: This is your own user!
</i18n>

<i18n locale="fr" lang="yaml">
warningMessage: Êtes-vous sûr de vouloir supprimer cet utilisateur ?
deleteUser: 'Suppression d''utilisateur'
ownUser: Ceci est votre utilisateur !
</i18n>
