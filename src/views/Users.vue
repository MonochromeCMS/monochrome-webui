<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="10" lg="8" class="mx-auto">
        <v-card rounded="lg" color="backgroundAlt" elevation="0" class="pa-4">
          <v-card-title class="justify-center lemon-milk">{{ $t('handleUsers') }}</v-card-title>
          <v-card-text>
            <user-filter v-model="filters" @update="getUsers" />
            <users-list :loading="loading" :users="users" :limit="limit" @update="getUsers">
              <tr v-if="users.length < limit && !loading" class="user-row">
                <td colspan="4">
                  <v-dialog v-model="addDialog" max-width="30rem">
                    <template #activator="{ on, attrs }">
                      <v-btn
                        tile
                        icon
                        block
                        color="primary"
                        :loading="loading"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>{{ icons.mdiPlus }}</v-icon>
                      </v-btn>
                    </template>
                    <user-form
                      :own-user="false"
                      :user="null"
                      @close="addDialog = false"
                      @update="getUsers"
                    />
                  </v-dialog>
                </td>
              </tr>
            </users-list>
            <v-row v-if="pageAmount > 1" cols="12">
              <v-pagination
                v-model="page"
                class="mx-auto pb-4"
                color="background text--primary"
                :length="pageAmount"
              ></v-pagination>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { mdiPlus } from '@mdi/js';
import type { AxiosRequestConfig } from 'axios';
import { Component, Vue, Watch } from 'vue-property-decorator';

import type { Role, UserResponse } from '@/api/User';
import User from '@/api/User';
import UserFilter from '@/components/UserFilter.vue';
import UserForm from '@/components/UserForm.vue';
import UsersList from '@/components/UsersList.vue';

@Component({
  components: { UserFilter, UserForm, UsersList },
})
export default class Users extends Vue {
  icons = {
    mdiPlus,
  };

  page = 1;

  total = 0;

  limit = 10;

  users: UserResponse[] = [];

  loading = true;

  addDialog = false;

  filters = {};

  get isConnected(): boolean {
    return this.$store.getters.isConnected;
  }

  get userRole(): Role {
    return this.$store.getters.userRole;
  }

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig;
  }

  get offset(): number {
    return (this.page - 1) * this.limit;
  }

  get pageAmount(): number {
    return Math.ceil((this.total + 1) / this.limit);
  }

  @Watch('page')
  onPageChange(): void {
    this.getUsers();
  }

  async getUsers(): Promise<void> {
    let config = this.authConfig;

    const response = await User.search(config, this.filters, this.limit, this.offset);

    if (response.data) {
      this.total = response.data.total;
      this.users = response.data.results;
    } else {
      const notification = {
        color: 'error',
        context: this.$t('getUsers'),
        message: response.error ?? '',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
    if (response.status === 401) {
      this.$store.commit('logout');
    }

    this.loading = false;
  }

  mounted(): void {
    if (!this.isConnected || !User.canEdit(this.userRole)) {
      this.$router.replace('/');
    } else {
      this.getUsers();
    }
  }
}
</script>

<i18n locale="en" lang="yaml">
getUsers: 'Get users'
handleUsers: 'Handle users'
</i18n>

<i18n locale="fr" lang="yaml">
getUsers: 'Chargement des utilisateurs'
handleUsers: 'Gestion des utilisateurs'
</i18n>
