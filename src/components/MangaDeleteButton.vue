<script setup lang="ts">
const props = defineProps<{
  mangaId: string
}>()

const router = useRouter()
const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()

const dialog = ref(false)

async function deleteManga() {
  const response = await Manga.delete(props.mangaId, auth.config)

  if (response.data !== null || response.status === 404)
    router.replace('/manga')
  else
    notifications.create('error', t('deleteManga'), response.error)

  dialog.value = false
}
</script>

<template>
  <v-btn color="error">
    {{ t('deleteManga') }}
    <v-dialog v-model="dialog" activator="parent" max-width="30rem">
      <v-card>
        <v-card-title class="text-h5 background mb-2">
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
          <v-btn color="error" @click="deleteManga">
            {{ t("delete") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<i18n locale="en" lang="yaml">
deleteManga: Delete manga
warningMessage: Are you sure you want to delete this manga?
  </i18n>

  <i18n locale="fr" lang="yaml">
deleteManga: Supprimer le manga
warningMessage: Êtes-vous sûr de vouloir supprimer ce manga?
  </i18n>
