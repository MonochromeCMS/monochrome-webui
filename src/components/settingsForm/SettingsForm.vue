<template>
  <validation-observer ref="observer">
    <settings-form-fields @submit="submit" />
  </validation-observer>
</template>

<script lang="ts">
import type { AxiosRequestConfig } from 'axios';
import { ValidationObserver } from 'vee-validate';
import { Component, Ref, Vue } from 'vue-property-decorator';

import type { SettingsSchema } from '@/api/Settings';
import Settings from '@/api/Settings';

import SettingsFormFields from './SettingsFormFields.vue';

@Component({
  components: {
    SettingsFormFields,
    ValidationObserver,
  },
})
export default class SettingsForm extends Vue {
  @Ref() readonly observer!: InstanceType<typeof ValidationObserver>;

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig;
  }

  async submit(ev: SettingsSchema): Promise<void> {
    const valid = await this.observer.validate();
    if (valid) {
      await this.editSettings(ev);
    }
  }

  async editSettings(params: SettingsSchema): Promise<void> {
    const response = await Settings.edit(params, this.authConfig);

    if (response.data) {
      this.$store.commit('setSettings', response.data);
      const notification = {
        color: 'success',
        context: this.$t('editSettings'),
        message: this.$t('editSuccess'),
      };
      await this.$store.dispatch('pushNotification', notification);
    } else {
      const notification = {
        color: 'error',
        context: this.$t('editSettings'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
  }
}
</script>
