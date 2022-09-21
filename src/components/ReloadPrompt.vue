<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

const { t } = useI18n()

const close = async () => {
  needRefresh.value = false
}
</script>

<template>
  <v-card v-if="needRefresh" class="pwa-toast ma-4">
    <v-card-text>
      {{ t('newVersionAvailable') }}
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="success" @click="updateServiceWorker()">
        {{ t('update') }}
      </v-btn>
      <v-btn variant="text" @click="close">
        {{ t('close') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style>
.pwa-toast {
  position: fixed !important;
  right: 0;
  bottom: 0;
  z-index: 3;
}
</style>

<i18n locale="en" lang="yaml">
newVersionAvailable: A new version is available, do you want to update?
update: Update
</i18n>

<i18n locale="fr" lang="yaml">
newVersionAvailable: Une nouvelle version est disponible, voulez-vous la mettre à jour ?
update: Mettre à jour
</i18n>
