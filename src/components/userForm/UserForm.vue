<template>
  <v-card :color="color">
    <v-card-title>{{ title }}</v-card-title>
    <v-alert v-if="ownUser" type="warning" dense class="ma-3">
      {{ $t("ownUserWarning") }}
    </v-alert>
    <v-card-text>
      <v-form ref="formRef" v-model="valid" @submit.prevent="submit">
        <user-form-fields
          ref="fields"
          :disabled="loading"
          :user="user"
          :color="color"
          :register="register"
          @close="close"
          @update="update"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import type { AxiosRequestConfig } from "axios"
import { Component, Emit, Prop, Ref, Vue } from "vue-property-decorator"

import type { UserResponse, UserSchema } from "@/api/User"
import User from "@/api/User"
import type { IVForm } from "@/formRules"

import type UserFormFields from "./UserFormFields.vue"

@Component
export default class UserForm extends Vue {
  @Ref() readonly formRef!: IVForm

  @Ref() readonly fields!: UserFormFields

  @Prop({ default: null }) readonly user!: UserResponse

  @Prop({ default: false, type: Boolean }) readonly register!: boolean

  @Prop({ default: "background", type: String }) readonly color!: string

  @Prop({ default: false, type: Boolean }) readonly ownUser!: boolean

  valid = false

  loading = false

  get title(): string {
    switch (true) {
      case this.register:
        return this.$tc("registerUser")
      case !!this.user:
        return this.$tc("editUser")
      default:
        return this.$tc("addUser")
    }
  }

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig
  }

  @Emit("close")
  close(): boolean {
    return true
  }

  clear(): void {
    this.fields.clear()
    this.formRef.reset()
  }

  async submit(): Promise<void> {
    this.formRef.validate()
    if (this.valid) {
      if (this.user) {
        await this.editUser(this.user.id, this.fields.params)
      } else if (this.register) {
        await this.registerUser(this.fields.params)
      } else {
        await this.addUser(this.fields.params)
      }
    }
  }

  async editUser(userId: string, params: UserSchema): Promise<void> {
    this.loading = true
    const response = await User.edit(userId, params, this.authConfig)

    if (response.data) {
      this.update()
      this.clear()
      this.close()
      if (this.ownUser) {
        this.$store.commit("logout")
      }
    } else {
      const notification = {
        color: "error",
        context: this.$t("editUser"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }

    this.loading = false
  }

  async addUser(params: UserSchema): Promise<void> {
    this.loading = true
    const response = await User.create(params, this.authConfig)

    if (response.data) {
      this.update()
      this.clear()
      this.close()
    } else {
      const notification = {
        color: "error",
        context: this.$t("addUser"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }

    this.loading = false
  }

  async registerUser(params: UserSchema): Promise<void> {
    this.loading = true
    const response = await User.register(params)

    if (response.data) {
      this.update()
      this.clear()
      this.close()
    } else {
      const notification = {
        color: "error",
        context: this.$t("registerUser"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }

    this.loading = false
  }

  @Emit("update")
  update(): boolean {
    return true
  }
}
</script>

<i18n locale="en" lang="yaml">
ownUserWarning: "You'll be logged out after editing your own user!"
registerUser: "Register user"
editUser: "Edit user"
addUser: "Add user"
</i18n>

<i18n locale="fr" lang="yaml">
ownUserWarning: "Vous allez être déconnecté après avoir modifié votre propre utilisateur!"
registerUser: "Inscription"
editUser: "Modification d'utilisateur"
addUser: "Ajout d'utilisateur"
</i18n>
