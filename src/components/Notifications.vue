<template>
  <v-snackbar
    :value="notificationsAmount"
    :color="notification ? notification.color : 'gray'"
    timeout="4000"
  >
    {{ notification ? `${notification.context}: ${notification.message}` : $t('noNotifications') }}

    <template #action="{ attrs }">
      <v-badge
        color="black"
        :content="notificationsAmount"
        :value="notificationsAmount"
        overlap
        offset-x="1.5rem"
        offset-y="1rem"
      >
        <v-btn dark text v-bind="attrs" @click="close">
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>
      </v-badge>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mdiClose } from '@mdi/js';
import type { Notification } from '@/store/notifications';

@Component
export default class ThemeToggler extends Vue {
  icons = {
    mdiClose,
  };

  close(): void {
    this.$store.commit('closeNotification');
  }

  get notification(): Notification {
    return this.$store.getters.getNotification;
  }

  get notificationsAmount(): number {
    return this.$store.getters.notificationsAmount;
  }
}
</script>

<i18n locale="en" lang="yaml">
noNotifications: 'No notifications left'
</i18n>

<i18n locale="fr" lang="yaml">
noNotifications: 'Il ne reste aucune notification'
</i18n>
