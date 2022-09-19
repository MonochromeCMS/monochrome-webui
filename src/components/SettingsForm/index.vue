<script setup lang="ts">
import { VForm } from 'vuetify/components'
import type Fields from './Fields.vue'
import type { SettingsSchema } from '@/api/Settings'

const form = ref<VForm>()
const fields = ref<InstanceType<typeof Fields>>()

const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()
const settings = useSettings()

const valid = ref(false)

async function submit() {
  await form.value?.validate()

  if (valid.value && fields.value)
    await editSettings(fields.value.params)
}

async function editSettings(params: SettingsSchema) {
  const response = await Settings.edit(params, auth.config)

  if (response.data !== null) {
    await settings.get()
    notifications.create('success', t('editSettings'), t('editSuccess'))
  }
  else {
    notifications.create('error', t('editSettings'), response.error)
  }
}
</script>

<template>
  <VForm ref="form" v-model="valid" @submit.prevent="submit">
    <settings-form-fields ref="fields" />
  </VForm>
</template>

<i18n locale="en" lang="yaml">
editSettings: Edit settings
editSuccess: The settings have been updated successfully.
</i18n>

<i18n locale="fr" lang="yaml">
editSettings: Modification des paramètres
editSuccess: Les paramètres ont été modifiés.
</i18n>
