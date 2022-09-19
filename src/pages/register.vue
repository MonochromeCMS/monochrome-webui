<script setup lang="ts">
const router = useRouter()
const { t } = useI18n()
const notifications = useNotifications()

const notification = () =>
  notifications.create('success', t('register'), t('registerSuccess'))

const goToLogin = () => router.push('/login')
</script>

<template>
  <v-container class="fill-height">
    <v-row class="h-100">
      <v-col cols="12" md="10" lg="8" class="ma-auto">
        <user-form
          color="backgroundAlt"
          :own-user="false"
          register
          @close="goToLogin"
          @update="notification"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<i18n locale="en" lang="yaml">
register: Register
registerSuccess: Account created successfully
</i18n>

<i18n locale="fr" lang="yaml">
register: Inscription
registerSuccess: Compte créé avec succès
</i18n>

<route lang="yaml">
meta:
  needsAuth: false
</route>
