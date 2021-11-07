<template>
  <validation-observer ref="observer">
    <v-form @submit.prevent="submit">
      <v-card :color="color">
        <v-card-title> {{ title }} </v-card-title>
        <v-alert type="warning" v-if="ownUser" dense class="ma-3">
          {{ $t('ownUserWarning') }}
        </v-alert>
        <v-card-text>
          <v-row>
            <avatar-input v-if="user" :user="user" @update="update()" />
            <v-col class="d-flex justify-end flex-column">
              <validation-provider
                v-slot="{ errors }"
                :name="$t('username')"
                rules="required|max:15"
              >
                <v-text-field
                  v-model="username"
                  :error-messages="errors"
                  :label="$t('username')"
                  required
                  outlined
                ></v-text-field>
              </validation-provider>
              <validation-provider v-slot="{ errors }" :name="$t('email')" rules="email">
                <v-text-field
                  v-model="email"
                  :error-messages="errors"
                  :label="$t('email')"
                  outlined
                ></v-text-field>
              </validation-provider>
              <validation-provider v-slot="{ errors }" :name="$t('password')" rules="required">
                <v-text-field
                  v-model="password"
                  :error-messages="errors"
                  :label="$t('password')"
                  :append-icon="showPass ? icons.mdiEye : icons.mdiEyeOff"
                  @click:append="showPass = !showPass"
                  required
                  outlined
                  :type="showPass ? 'text' : 'password'"
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
          <validation-provider
            v-if="canEditRoles || user"
            v-slot="{ errors }"
            :name="$t('role')"
            rules="required"
          >
            <v-select
              :items="roleItems"
              v-model="role"
              :error-messages="errors"
              :label="$t('role')"
              outlined
              :disabled="!canEditRoles"
            ></v-select>
          </validation-provider>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <slot />
          <v-btn color="gray" text @click="close">{{ $t('cancel') }}</v-btn>
          <v-btn :disabled="loading" type="submit" color="green" class="text--white">
            {{ buttonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </validation-observer>
</template>

<script lang="ts">
import { required, email, max } from 'vee-validate/dist/rules';
import { extend, ValidationProvider, setInteractionMode, ValidationObserver } from 'vee-validate';
import { Vue, Component, Emit, Prop } from 'vue-property-decorator';
import User from '@/api/User';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import type { AxiosRequestConfig } from 'axios';
import type { UserSchema } from '@/api/User';
import AvatarInput from '@/components/AvatarInput.vue';

setInteractionMode('eager');

extend('max', {
  ...max,
  message: "{_field_} can't be that long",
});

extend('email', {
  ...email,
  message: '{_field_} must be a valid email',
});

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
});

@Component({
  components: {
    AvatarInput,
    ValidationProvider,
    ValidationObserver,
  },
})
export default class UserForm extends Vue {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>;
  };

  @Prop({ default: null }) readonly user!: any;

  @Prop({ default: false, type: Boolean }) readonly register!: any;

  @Prop({ type: String, default: 'background' }) readonly color!: string;

  @Prop({ default: false, type: Boolean }) readonly ownUser!: boolean;

  icons = {
    mdiEye,
    mdiEyeOff,
  };

  username = '';

  password = '';

  email = null;

  showPass = false;

  loading = false;

  role = null;

  roleItems = [
    { value: 'admin', text: this.upper(this.$tc('roles.admin')) },
    { value: 'uploader', text: this.upper(this.$tc('roles.uploader')) },
    { value: 'user', text: this.upper(this.$tc('roles.user')) },
  ];

  mounted(): void {
    if (this.user) {
      this.username = this.user.username;
      this.password = this.user.password;
      this.email = this.user.email;
      this.role = this.user.role;
    }
  }

  upper(str: string): string {
    return str ? str[0].toUpperCase() + str.slice(1) : '';
  }

  get title(): string {
    switch (true) {
      case this.register:
        return this.$tc('registerUser');
      case !!this.user:
        return this.$tc('editUser');
      default:
        return this.$tc('addUser');
    }
  }

  get buttonText(): string {
    switch (true) {
      case this.register:
        return this.$tc('register');
      case !!this.user:
        return this.$tc('edit');
      default:
        return this.$tc('add');
    }
  }

  get canEditRoles(): boolean {
    return User.canEdit(this.$store.getters.userRole);
  }

  get params(): any {
    return {
      username: this.username,
      password: this.password,
      email: this.email || undefined,
      role: this.role || undefined,
    };
  }

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig;
  }

  @Emit('close')
  close(): boolean {
    return true;
  }

  async submit(): Promise<void> {
    const valid = await this.$refs.observer.validate();
    if (valid) {
      if (this.user) {
        await this.editUser(this.user.id, this.params);
      } else if (this.register) {
        await this.registerUser(this.params);
      } else {
        await this.addUser(this.params);
      }
    }
  }

  clear(): void {
    this.username = '';
    this.email = null;
    this.password = '';
    this.role = null;
  }

  async editUser(userId: string, params: UserSchema): Promise<void> {
    this.loading = true;
    const response = await User.edit(userId, params, this.authConfig);

    if (response.data) {
      this.update();
      this.close();
      if (this.ownUser) {
        this.$store.commit('logout');
      }
    } else {
      const notification = {
        context: this.$t('editUser'),
        message: response.error ?? '',
        color: 'error',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
    if (response.status === 401) {
      this.$store.commit('logout');
    }

    this.loading = false;
  }

  async addUser(params: UserSchema): Promise<void> {
    this.loading = true;
    const response = await User.create(params, this.authConfig);

    if (response.data) {
      this.update();
      this.clear();
      this.close();
    } else {
      const notification = {
        context: this.$t('addUser'),
        message: response.error ?? '',
        color: 'error',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
    if (response.status === 401) {
      this.$store.commit('logout');
    }

    this.loading = false;
  }

  async registerUser(params: UserSchema): Promise<void> {
    this.loading = true;
    const response = await User.register(params);

    if (response.data) {
      this.update();
      this.clear();
      this.close();
    } else {
      const notification = {
        context: this.$t('registerUser'),
        message: response.error ?? '',
        color: 'error',
      };
      await this.$store.dispatch('pushNotification', notification);
    }

    this.loading = false;
  }

  @Emit('update')
  update(): boolean {
    return true;
  }
}
</script>

<style lang="scss">
.relative {
  position: relative;
}
.edit-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
</style>

<i18n locale="en" lang="yaml">
ownUserWarning: "You'll be logged out after editing your own user!"
username: 'Username'
email: 'Email'
password: 'Password'
role: 'Role'
registerUser: 'Register user'
editUser: 'Edit user'
addUser: 'Add user'
register: 'Register'
edit: 'Edit'
add: 'Add'
</i18n>

<i18n locale="fr" lang="yaml">
ownUserWarning: 'Vous allez être déconnecté après avoir modifié votre propre utilisateur!'
username: "Nom d'utilisateur"
email: 'Email'
password: 'Mot de passe'
role: 'Rôle'
registerUser: 'Inscription'
editUser: "Modification d'utilisateur"
addUser: "Ajout d'utilisateur"
register: "S'inscrire"
edit: 'Modifier'
add: 'Ajouter'
</i18n>
