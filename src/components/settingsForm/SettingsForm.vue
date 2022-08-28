<template>
  <v-form ref="formRef" v-model="valid" @submit.prevent="submit">
    <settings-form-fields ref="fields" />
  </v-form>
</template>

<script lang="ts">
import type { AxiosRequestConfig } from "axios"
import { Component, Ref, Vue } from "vue-property-decorator"

import type { SettingsSchema } from "@/api/Settings"
import Settings from "@/api/Settings"
import type { IVForm } from "@/formRules"

import type SettingsFormFields from "./SettingsFormFields.vue"

@Component
export default class SettingsForm extends Vue {
  @Ref() readonly formRef!: IVForm

  @Ref() readonly fields!: SettingsFormFields

  valid = false

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig
  }

  async submit(): Promise<void> {
    this.formRef.validate()
    if (this.valid) {
      await this.editSettings(this.fields.params)
    }
  }

  async editSettings(params: SettingsSchema): Promise<void> {
    const response = await Settings.edit(params, this.authConfig)

    if (response.data) {
      this.$store.commit("setSettings", response.data)
      await this.$store.dispatch("getSettings")
      const notification = {
        color: "success",
        context: this.$t("editSettings"),
        message: this.$t("editSuccess"),
      }
      await this.$store.dispatch("pushNotification", notification)
    } else {
      const notification = {
        color: "error",
        context: this.$t("editSettings"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }
  }
}
</script>

<i18n locale="en" lang="yaml">
editSettings: "Edit settings"
editSuccess: "The settings have been updated successfully."
</i18n>

<i18n locale="fr" lang="yaml">
editSettings: "Modification des paramètres"
editSuccess: "Les paramètres ont été modifiés."
</i18n>
