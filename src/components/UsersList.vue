<template>
  <v-simple-table class="mb-4">
    <template v-slot:default>
      <thead>
        <tr class="user-row">
          <th
            class="text-center text--primary text-h5"
            v-for="val in headers"
            :key="val.title"
            :class="val.class"
          >
            {{ val.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="l in loading ? limit : 0" class="user-row" :key="l">
          <td v-for="i in headers.length - 2" :key="i">
            <v-skeleton-loader type="heading" class="d-flex justify-center" />
          </td>
          <td class="hidden-sm-and-down">
            <v-skeleton-loader type="heading" class="d-flex justify-center" />
          </td>
          <td>
            <v-skeleton-loader
              width="150px"
              type="button,button"
              class="d-flex justify-space-around mx-auto"
            />
          </td>
        </tr>
        <tr
          class="user-row text-center text-body-1 text--primary"
          v-for="item in users"
          :key="item.id"
        >
          <td class="first-capital">{{ $t(`roles.${item.role}`) }}</td>
          <td>
            <div class="d-flex align-center">
              <v-img
                :src="avatar(item.id, item.version)"
                :lazy-src="defAvatar"
                width="1.5rem"
                height="1.5rem"
                class="rounded-circle"
              />
              <div style="width: 100%">
                {{ item.username }}
              </div>
            </div>
          </td>
          <td class="hidden-sm-and-down ellipsis email">{{ item.email }}</td>
          <td class="d-flex justify-center align-center">
            <user-edit-button :user="item" :ownUser="userId === item.id" @update="update" />
            <user-delete-button :user="item" :ownUser="userId === item.id" @update="update" />
          </td>
        </tr>
        <slot />
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import UserEditButton from '@/components/UserEditButton.vue';
import UserDeleteButton from '@/components/UserDeleteButton.vue';
import Media from '@/api/Media';

@Component({
  components: { UserDeleteButton, UserEditButton },
})
export default class UsersList extends Vue {
  @Prop() readonly users!: any[];

  @Prop(Number) readonly limit!: number;

  @Prop(Boolean) readonly loading!: boolean;

  defAvatar = Media.defaultAvatar;

  headers = [
    {
      title: this.$t('role'),
    },
    {
      title: this.$t('username'),
    },
    {
      title: this.$t('email'),
      class: 'hidden-sm-and-down',
    },
    {
      title: this.$t('actions'),
    },
  ];

  get userId(): string {
    return this.$store.getters.userId;
  }

  avatar(userId: string, version: number): string {
    return Media.avatar(userId, version);
  }

  @Emit('update')
  update(): boolean {
    return true;
  }
}
</script>

<style lang="scss">
.v-data-table__wrapper {
  border-radius: 0.5rem;
}

.first-capital::first-letter {
  text-transform: capitalize;
}

.theme--dark {
  .user-row {
    background-color: black;
    border-bottom: #212121 0.2rem solid;
  }
}
.theme--light {
  .user-row {
    background-color: #eeeeee;
    border-bottom: white 0.2rem solid;
  }
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.email {
  max-width: 13rem;
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
