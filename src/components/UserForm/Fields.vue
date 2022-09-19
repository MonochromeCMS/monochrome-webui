<script setup lang="ts">
import { mdiEye, mdiEyeOff } from '@mdi/js'

import type { Role, UserResponse, UserSchema } from '@/api/User'
import { email, max, required } from '@/composables/formRules'

const props = defineProps<{
  user?: UserResponse
  register: boolean
}>()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'update'): void
}>()

const { t } = useI18n()
const auth = useAuth()

const params = reactive({
  email: null,
  password: '',
  role: 'user' as Role,
  username: '',
} as UserSchema)

const showPass = ref(false)

const upper = (t: string) => (t ? t[0].toUpperCase() + t.slice(1) : t)

const roleItems = computed(() => [
  { title: upper(t('roles.admin')), value: 'admin' },
  { title: upper(t('roles.uploader')), value: 'uploader' },
  { title: upper(t('roles.user')), value: 'user' },
])

const buttonText = computed(() => {
  switch (true) {
    case props.register:
      return t('register')
    case !!props.user:
      return t('edit')
    default:
      return t('add')
  }
})

const canEditRoles = computed(() => User.canEdit(auth.role))

function set(user?: UserResponse) {
  if (user) {
    params.email = user.email
    params.role = user.role
    params.username = user.username
  }
}

watchEffect(() => set(props.user))

defineExpose({
  params,
})
</script>

<template>
  <v-row>
    <user-form-avatar v-if="user" :user="user" @update="emits('update')" />
    <v-col>
      <v-row justify="start" class="mb-0">
        <v-col cols="12">
          <v-text-field
            v-model="params.username"
            :rules="[required, max(15)]"
            :label="t('username')"
            variant="outlined"
            hide-details="auto"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="params.email"
            :rules="[email]"
            :label="t('email')"
            variant="outlined"
            hide-details="auto"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-text-field
        v-model="params.password"
        :rules="user ? [] : [required]"
        :label="t('password')"
        :append-inner-icon="showPass ? mdiEye : mdiEyeOff"
        :type="showPass ? 'text' : 'password'"
        :required="!user"
        variant="outlined"
        hide-details="auto"
        @click:append-inner="showPass = !showPass"
      />
    </v-col>
    <v-col v-if="canEditRoles || user" cols="12">
      <v-select
        v-model="params.role"
        :items="roleItems"
        :rules="[required]"
        :label="t('role')"
        :disabled="!canEditRoles"
        variant="outlined"
        required
      />
    </v-col>
  </v-row>
  <v-divider />
  <v-card-actions>
    <v-spacer />
    <v-btn color="gray" class="mr-2" text @click="emits('close')">
      {{ t("cancel") }}
    </v-btn>
    <v-btn
      type="submit"
      :color="user ? 'warning' : 'success'"
      class="text--white"
    >
      {{ buttonText }}
    </v-btn>
  </v-card-actions>
</template>

<i18n locale="en" lang="yaml">
username: Username
email: Email
password: Password
role: Role
registerUser: Register user
editUser: Edit user
addUser: Add user
register: Register
edit: Edit
add: Add
</i18n>

<i18n locale="fr" lang="yaml">
username: 'Nom d''utilisateur'
email: Email
password: Mot de passe
role: Rôle
registerUser: Inscription
editUser: 'Modification d''utilisateur'
addUser: 'Ajout d''utilisateur'
register: 'S''inscrire'
edit: Modifier
add: Ajouter
</i18n>
