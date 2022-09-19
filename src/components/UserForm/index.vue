<script setup lang="ts">
import { VForm } from 'vuetify/components'
import type Fields from './Fields.vue'
import type { UserResponse, UserSchema } from '@/api/User'

const props = withDefaults(
  defineProps<{
    user?: UserResponse
    register?: boolean
    color?: string
    ownUser?: boolean
  }>(),
  {
    user: undefined,
    register: false,
    color: 'background',
    ownUser: false,
  },
)

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'update'): void
}>()

const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()

const form = ref<VForm>()
const fields = ref<InstanceType<typeof Fields>>()
const valid = ref(false)
const loading = ref(false)

const title = computed(() => {
  switch (true) {
    case props.register:
      return t('registerUser')
    case !!props.user:
      return t('editUser')
    default:
      return t('addUser')
  }
})

async function submit() {
  loading.value = true
  await form.value?.validate()
  if (valid.value && fields.value) {
    if (props.user)
      await editUser(props.user.id, fields.value.params)
    else if (props.register)
      await registerUser(fields.value.params)
    else
      await addUser(fields.value.params)
  }
  loading.value = false
}

async function addUser(params: UserSchema) {
  const response = await User.create(params, auth.config)

  if (response.data !== null) {
    emits('update')
    form.value?.reset()
    emits('close')
  }
  else {
    notifications.create('error', t('addUser'), response.error)
  }
}

async function editUser(userId: string, params: UserSchema) {
  const response = await User.edit(userId, params, auth.config)

  if (response.data !== null) {
    if (props.ownUser)
      await auth.logout()

    emits('update')
    form.value?.reset()
    emits('close')
  }
  else {
    notifications.create('error', t('editUser'), response.error)
  }
}

async function registerUser(params: UserSchema) {
  const response = await User.register(params)

  if (response.data !== null) {
    emits('update')
    form.value?.reset()
    emits('close')
  }
  else {
    notifications.create('error', t('registerUser'), response.error)
  }
}
</script>

<template>
  <v-card :color="color" :title="title" :loading="loading" :disabled="loading">
    <v-card-text>
      <v-alert v-if="ownUser" type="warning" dense class="mb-6">
        {{ t("ownUserWarning") }}
      </v-alert>
      <VForm ref="form" v-model="valid" @submit.prevent="submit">
        <user-form-fields
          ref="fields"
          :user="user"
          :register="register"
          @update="emits('update')"
          @close="emits('close')"
        />
      </VForm>
    </v-card-text>
  </v-card>
</template>

<i18n locale="en" lang="yaml">
ownUserWarning: 'You''ll be logged out after editing your own user!'
registerUser: Register user
editUser: Edit user
addUser: Add user
</i18n>

<i18n locale="fr" lang="yaml">
ownUserWarning: Vous allez être déconnecté après avoir modifié votre propre utilisateur!
registerUser: Inscription
editUser: 'Modification d''utilisateur'
addUser: 'Ajout d''utilisateur'
</i18n>
