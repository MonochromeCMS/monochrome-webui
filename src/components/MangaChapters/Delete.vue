<script setup lang="ts">
const props = defineProps<{
  chapterId: string
}>()

const emits = defineEmits<{
  (e: 'delete'): void
}>()

const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()

const dialog = ref(false)

async function deleteChapter() {
  const response = await Chapter.delete(props.chapterId, auth.config)

  if (response.data !== null) {
    emits('delete')
    dialog.value = false
  }
  else {
    notifications.create('error', t('deleteChapter'), response.error)
  }
}
</script>

<template>
  <v-btn color="error" block>
    {{ t('deleteChapter') }}
    <v-dialog v-model="dialog" activator="parent" max-width="30rem">
      <v-card>
        <v-card-title class="text-h5 bg-background mb-2">
          {{ t("warning") }}
        </v-card-title>

        <v-card-text class="body-1">
          <span class="font-weight-bold">{{ t("warningBoldMessage") }}</span>
          {{ t("warningMessage") }}
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn color="gray" text @click="dialog = false">
            {{ t("cancel") }}
          </v-btn>
          <v-btn color="error" @click="deleteChapter">
            {{ t("delete") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<i18n locale="en" lang="yaml">
deleteChapter: Delete chapter
warningMessage: Are you sure you want to delete this chapter?
</i18n>

<i18n locale="fr" lang="yaml">
deleteChapter: Supprimer le chapitre
warningMessage: Êtes-vous sûr de vouloir supprimer ce chapitre ?
</i18n>
