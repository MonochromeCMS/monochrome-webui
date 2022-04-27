<template>
  <v-form @submit.prevent="submit">
    <v-row>
      <avatar-input v-if="user" :user="user" :disabled="disabled" @update="update()" />
      <v-col class="d-flex justify-end flex-column">
        <validation-provider v-slot="{ errors }" :name="$t('username')" rules="required|max:15">
          <v-text-field
            v-model="username"
            :error-messages="errors"
            :label="$t('username')"
            required
            outlined
          />
        </validation-provider>
        <validation-provider v-slot="{ errors }" :name="$t('email')" rules="email">
          <v-text-field v-model="email" :error-messages="errors" :label="$t('email')" outlined />
        </validation-provider>
        <validation-provider v-slot="{ errors }" :name="$t('password')" rules="required">
          <v-text-field
            v-model="password"
            :error-messages="errors"
            :label="$t('password')"
            :append-icon="showPass ? icons.mdiEye : icons.mdiEyeOff"
            required
            outlined
            :type="showPass ? 'text' : 'password'"
            @click:append="showPass = !showPass"
          />
        </validation-provider>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="py-0">
        <validation-provider
          v-if="canEditRoles || user"
          v-slot="{ errors }"
          :name="$t('role')"
          rules="required"
        >
          <v-select
            v-model="role"
            :items="roleItems"
            :error-messages="errors"
            :label="$t('role')"
            outlined
            :disabled="!canEditRoles"
          />
        </validation-provider>
      </v-col>
    </v-row>

    <v-divider />
    <div class="d-flex justify-end pt-4">
      <v-btn color="gray" class="mr-2" text @click="close">{{ $t("cancel") }}</v-btn>
      <v-btn :disabled="disabled" type="submit" color="green" class="text--white">
        {{ buttonText }}
      </v-btn>
    </div>
  </v-form>
</template>

<script lang="ts">
import { mdiEye, mdiEyeOff } from "@mdi/js"
import { Component, Emit, Prop, Vue } from "vue-property-decorator"

import type { Role, UserSchema } from "@/api/User"
import User from "@/api/User"

@Component
export default class UserForm extends Vue {
  @Prop() readonly user!: UserSchema

  @Prop(String) readonly color!: string

  @Prop(Boolean) readonly register!: boolean

  @Prop(Boolean) readonly disabled!: boolean

  icons = {
    mdiEye,
    mdiEyeOff,
  }

  username = ""

  password = ""

  email?: string | null = null

  showPass = false

  role: Role = "user"

  roleItems = [
    { text: this.upper(this.$tc("roles.admin")), value: "admin" },
    { text: this.upper(this.$tc("roles.uploader")), value: "uploader" },
    { text: this.upper(this.$tc("roles.user")), value: "user" },
  ]

  set(user: UserSchema) {
    this.username = user.username
    this.password = user.password
    this.email = user.email
    this.role = user.role
  }

  mounted(): void {
    if (this.user) {
      this.set(this.user)
    }
  }

  upper(str: string): string {
    return str ? str[0].toUpperCase() + str.slice(1) : ""
  }

  get buttonText(): string {
    switch (true) {
      case this.register:
        return this.$tc("register")
      case !!this.user:
        return this.$tc("edit")
      default:
        return this.$tc("add")
    }
  }

  get canEditRoles(): boolean {
    return User.canEdit(this.$store.getters.userRole)
  }

  get params(): UserSchema {
    return {
      email: this.email || undefined,
      password: this.password,
      role: this.role || undefined,
      username: this.username,
    }
  }

  @Emit("submit")
  submit(): UserSchema {
    return this.params
  }

  @Emit("update")
  update(): boolean {
    return true
  }

  @Emit("close")
  close(): boolean {
    return true
  }

  clear(): void {
    this.username = ""
    this.email = null
    this.password = ""
    this.role = "user"
  }
}
</script>

<i18n locale="en" lang="yaml">
username: "Username"
email: "Email"
password: "Password"
role: "Role"
registerUser: "Register user"
editUser: "Edit user"
addUser: "Add user"
register: "Register"
edit: "Edit"
add: "Add"
</i18n>

<i18n locale="fr" lang="yaml">
username: "Nom d'utilisateur"
email: "Email"
password: "Mot de passe"
role: "Rôle"
registerUser: "Inscription"
editUser: "Modification d'utilisateur"
addUser: "Ajout d'utilisateur"
register: "S'inscrire"
edit: "Modifier"
add: "Ajouter"
</i18n>
