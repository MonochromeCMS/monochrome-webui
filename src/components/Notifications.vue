<script setup lang="ts">
import { mdiClose } from '@mdi/js'

const { t } = useI18n()

const notifications = useNotifications()

const show = ref(false)

notifications.$subscribe((_, state) => {
  show.value = !!state.displayAmount
})

const notificationText = computed(() => {
  if (notifications.latest)
    return `${notifications.latest.context}: ${notifications.latest.message}`
  else
    return t('noNotifications')
})

const notificationColor = computed(() =>
  notifications.latest ? notifications.latest.color : 'gray',
)
</script>

<template>
  <v-snackbar
    v-model="show"
    variant="tonal"
    :color="notificationColor"
    :timeout="4000"
  >
    {{ notificationText }}

    <template #actions>
      <v-btn icon @click="notifications.close()">
        <v-badge
          :model-value="notifications.amount > 1"
          color="black"
          :content="notifications.amount"
        >
          <v-icon>{{ mdiClose }}</v-icon>
        </v-badge>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<i18n locale="en" lang="yaml">
noNotifications: No notifications left
</i18n>

<i18n locale="fr" lang="yaml">
noNotifications: Il ne reste aucune notification
</i18n>
