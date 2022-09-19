<script setup lang="ts">
import { mdiEye, mdiEyeOff } from '@mdi/js'
import { VForm } from 'vuetify/components'
import { required } from '@/composables/formRules'
import type { LoginForm } from '@/api/Auth'

const { t } = useI18n()
const auth = useAuth()

const notifications = useNotifications()

const showPass = ref(false)

const form = ref<VForm>()
const valid = ref(false)

const formData = reactive({
  username: '',
  password: '',
} as LoginForm)

async function submit() {
  await form.value?.validate()

  if (valid.value)
    await login(formData)
}

async function login(params: LoginForm) {
  const response = await auth.login(params)

  if (response.data === null)
    notifications.create('error', t('login'), response.error)
}
</script>

<template>
  <VForm ref="form" v-model="valid" @submit.prevent="submit">
    <v-text-field
      v-model="formData.username"
      :label="t('usernameEmail')"
      :rules="[required]"
      variant="outlined"
      hide-details="auto"
      required
      class="my-4"
    />
    <v-text-field
      v-model="formData.password"
      :label="t('password')"
      :rules="[required]"
      :append-inner-icon="showPass ? mdiEye : mdiEyeOff"
      :type="showPass ? 'text' : 'password'"
      variant="outlined"
      hide-details="auto"
      required
      class="my-4"
      @click:append-inner="showPass = !showPass"
    />
    <v-btn type="submit" color="background" class="text-primary" block>
      {{ t("signIn") }}
    </v-btn>
  </VForm>
</template>

<i18n locale="en" lang="yaml">
usernameEmail: Username/Email
password: Password
signIn: Sign In
login: Login
</i18n>

<i18n locale="fr" lang="yaml">
usernameEmail: 'Nom d''utilisateur/Email'
password: Mot de passe
signIn: Se connecter
login: Connexion
</i18n>
