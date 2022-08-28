<template>
  <v-form ref="formRef" v-model="valid" @submit.prevent="submit">
    <v-text-field
      v-model="username"
      :label="$t('usernameEmail')"
      :rules="[f.required]"
      required
      outlined
    />
    <v-text-field
      v-model="password"
      :label="$t('password')"
      :rules="[f.required]"
      :append-icon="showPass ? icons.mdiEye : icons.mdiEyeOff"
      required
      outlined
      :type="showPass ? 'text' : 'password'"
      @click:append="showPass = !showPass"
    />
    <div class="text-center">
      <v-btn type="submit" block color="background" class="text--primary">
        {{ $t("signIn") }}
      </v-btn>
    </div>
  </v-form>
</template>

<script lang="ts">
import { mdiEye, mdiEyeOff } from "@mdi/js"
import { Component, Ref, Vue } from "vue-property-decorator"

import type { TokenResponse } from "@/api/Auth"
import type { ApiResponse } from "@/api/Base"
import type { IVForm } from "@/formRules"
import { required } from "@/formRules"
import type { UserLogin } from "@/store/user"

@Component
export default class LoginForm extends Vue {
  @Ref() readonly formRef!: IVForm

  f = {
    required,
  }

  valid = false

  icons = {
    mdiEye,
    mdiEyeOff,
  }

  username = ""

  password = ""

  showPass = false

  get params(): UserLogin {
    return {
      password: this.password,
      username: this.username,
    }
  }

  async submit(): Promise<void> {
    this.formRef.validate()
    if (this.valid) {
      await this.login(this.params)
    }
  }

  reset(): void {
    this.username = ""
    this.password = ""
    this.formRef.reset()
  }

  async login(params: UserLogin): Promise<void> {
    // this.reset() Not needed as we redirect on success
    const response: ApiResponse<TokenResponse> = await this.$store.dispatch("login", params)

    if (response.data === null) {
      const notification = {
        color: "error",
        context: this.$t("login"),
        message: response.error ?? "",
      }
      await this.$store.dispatch("pushNotification", notification)
    }
  }
}
</script>

<i18n locale="en" lang="yaml">
usernameEmail: "Username/Email"
password: "Password"
signIn: "Sign In"
login: "Login"
</i18n>

<i18n locale="fr" lang="yaml">
usernameEmail: "Nom d'utilisateur/Email"
password: "Mot de passe"
signIn: "Se connecter"
login: "Connexion"
</i18n>
