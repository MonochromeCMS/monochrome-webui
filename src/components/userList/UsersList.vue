<template>
  <v-simple-table class="users-table mb-4">
    <template #default>
      <thead>
        <tr class="user-row">
          <th
            v-for="val in headers"
            :key="val.title"
            class="text-center text--primary text-h5"
            :class="val.class"
          >
            {{ val.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <users-row-loading
          v-for="x in loading ? limit : 0"
          :key="x"
          :headers-amount="headers.length"
        />
        <user-row v-for="item in users" :key="item.id" :user="item" @update="update" />
        <slot />
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

import type { UserResponse } from '@/api/User';

import UserRow from './UserRow.vue';
import UsersRowLoading from './UserRowLoading.vue';

@Component({
  components: { UserRow, UsersRowLoading },
})
export default class UsersList extends Vue {
  @Prop() readonly users!: UserResponse[];

  @Prop(Number) readonly limit!: number;

  @Prop(Boolean) readonly loading!: boolean;

  headers = [
    {
      title: this.$t('role'),
    },
    {
      title: this.$t('username'),
    },
    {
      class: 'hidden-sm-and-down',
      title: this.$t('email'),
    },
    {
      title: this.$t('actions'),
    },
  ];

  @Emit('update')
  update(): boolean {
    return true;
  }
}
</script>

<style lang="scss">
.users-table .v-data-table__wrapper {
  border-radius: 0.5rem;
}
</style>

<i18n locale="en" lang="yaml">
role: 'Role'
username: 'Username'
email: 'Email'
actions: 'Actions'
</i18n>

<i18n locale="fr" lang="yaml">
role: 'Rôle'
username: "Nom d'utilisateur"
email: 'Email'
actions: 'Actions'
</i18n>
