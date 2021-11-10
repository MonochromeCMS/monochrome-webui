<template>
  <validation-observer ref="observer">
    <v-form @submit.prevent="submit">
      <validation-provider v-slot="{ errors }" :name="$t('usernameEmail')" rules="required">
        <v-text-field
          v-model="username"
          :error-messages="errors"
          :label="$t('usernameEmail')"
          required
          outlined
        />
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
      <div class="text-center">
        <v-btn type="submit" block color="background" class="text--primary">{{
          $t('signIn')
        }}</v-btn>
      </div>
    </v-form>
  </validation-observer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { required } from 'vee-validate/dist/rules';
import { extend, ValidationProvider, setInteractionMode, ValidationObserver } from 'vee-validate';
import { mdiEye, mdiEyeOff } from '@mdi/js';

setInteractionMode('eager');

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
})
export default class LoginForm extends Vue {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>;
  };

  icons = {
    mdiEye,
    mdiEyeOff,
  };

  username = '';

  password = '';

  showPass = false;

  get params(): any {
    return {
      username: this.username,
      password: this.password,
    };
  }

  async submit(): Promise<void> {
    const valid = await this.$refs.observer.validate();
    if (valid) {
      await this.login(this.params);
    }
  }

  clear(): void {
    this.username = '';
    this.password = '';
  }

  async login(params: any): Promise<void> {
    const response = await this.$store.dispatch('login', params);

    if (response.data) {
      this.clear();
    } else {
      const notification = {
        context: this.$t('login'),
        message: response.error ?? '',
        color: 'error',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
  }
}
</script>

<i18n locale="en" lang="yaml">
usernameEmail: 'Username/Email'
password: 'Password'
signIn: 'Sign In'
login: 'Login'
</i18n>

<i18n locale="fr" lang="yaml">
usernameEmail: "Nom d'utilisateur/Email"
password: 'Mot de passe'
signIn: 'Se connecter'
login: 'Connexion'
</i18n>
