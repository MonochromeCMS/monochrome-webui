<template>
  <validation-observer ref="observer">
    <v-form @submit.prevent="submit">
      <v-card :color="color">
        <v-card-title> {{ title }} </v-card-title>
        <v-alert type="warning" v-if="ownUser" dense class="ma-3">
          You'll be logged out after editing your own user !
        </v-alert>
        <v-card-text>
          <v-row>
            <avatar-input v-if="user" :user="user" @update="update()" />
            <v-col class="d-flex justify-end flex-column">
              <validation-provider v-slot="{ errors }" name="Username" rules="required|max:15">
                <v-text-field
                  v-model="username"
                  :error-messages="errors"
                  label="Username"
                  required
                  outlined
                ></v-text-field>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="Email" rules="email">
                <v-text-field
                  v-model="email"
                  :error-messages="errors"
                  label="Email"
                  outlined
                ></v-text-field>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="Password" rules="required">
                <v-text-field
                  v-model="password"
                  :error-messages="errors"
                  label="Password"
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
            name="Role"
            rules="required"
          >
            <v-select
              :items="roleItems"
              v-model="role"
              :error-messages="errors"
              label="Role"
              outlined
              :disabled="!canEditRoles"
            ></v-select>
          </validation-provider>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <slot />
          <v-btn color="gray" text @click="close"> Cancel </v-btn>
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
    { value: 'admin', text: 'Admin' },
    { value: 'uploader', text: 'Uploader' },
    { value: 'user', text: 'User' },
  ];

  mounted(): void {
    if (this.user) {
      this.username = this.user.username;
      this.password = this.user.password;
      this.email = this.user.email;
      this.role = this.user.role;
    }
  }

  get title(): string {
    switch (true) {
      case this.register:
        return 'Register user';
      case !!this.user:
        return 'Edit user';
      default:
        return 'Add user';
    }
  }

  get buttonText(): string {
    switch (true) {
      case this.register:
        return 'Register';
      case !!this.user:
        return 'Edit';
      default:
        return 'Add';
    }
  }

  get userRole(): string {
    return this.$store.getters.userRole;
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
    //@ts-expect-error I can't define this $ref, so let's assume it works
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
        context: 'Edit user',
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
        context: 'Create user',
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
        context: 'Register user',
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
