<script setup lang="ts">
import { mdiDelete, mdiDotsVertical, mdiPencil, mdiReply } from '@mdi/js'

defineProps<{
  canEdit: boolean
  canCreate: boolean
}>()

const emits = defineEmits<{
  (event: 'reply'): void
  (event: 'delete'): void
  (event: 'edit'): void
}>()

const { t } = useI18n()

const deleteDialog = ref(false)

function deleteComment() {
  deleteDialog.value = true
  emits('delete')
}
</script>

<template>
  <v-dialog v-model="deleteDialog" max-width="30rem">
    <v-card>
      <v-card-title class="text-h5 bg-background pa-4">
        {{ t("warning") }}
      </v-card-title>
      <v-card-text class="body-1">
        <span class="font-weight-bold">{{ t("warningBoldMessage") }}</span>
        {{ t("warningMessage") }}
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="gray" text @click="deleteDialog = false">
          {{ t("cancel") }}
        </v-btn>
        <v-btn color="error" @click="deleteComment">
          {{ t("delete") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div class="hidden-sm-and-down d-flex-alt">
    <v-btn v-if="canEdit" icon size="small" variant="text" @click="emits('edit')">
      <v-icon :icon="mdiPencil" />
    </v-btn>
    <v-btn v-if="canEdit" icon size="small" variant="text" @click="deleteDialog = true">
      <v-icon :icon="mdiDelete" />
    </v-btn>
    <v-btn v-if="canCreate" icon size="small" variant="text" @click="emits('reply')">
      <v-icon :icon="mdiReply" />
    </v-btn>
  </div>

  <div class="hidden-md-and-up d-flex-alt">
    <v-btn v-if="canEdit || canCreate" icon size="small" variant="text">
      <v-icon :icon="mdiDotsVertical" />
      <v-menu activator="parent">
        <v-list>
          <v-list-item v-if="canCreate" @click="emits('reply')">
            {{ t("reply") }}
          </v-list-item>
          <v-list-item v-if="canEdit" @click="emits('edit')">
            {{ t("edit") }}
          </v-list-item>
          <v-list-item v-if="canEdit" @click.stop="deleteDialog = true">
            {{ t("delete") }}
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </div>
</template>

<style>
  .d-flex-alt {
    display: flex;
  }
</style>

<i18n locale="en" lang="yaml">
warningMessage: Are you sure you want to delete this comment?
reply: Reply
edit: Edit
</i18n>

<i18n locale="fr" lang="yaml">
warningMessage: Êtes-vous sûr de vouloir supprimer ce commentaire ?
reply: Répondre
edit: Modifier
</i18n>
