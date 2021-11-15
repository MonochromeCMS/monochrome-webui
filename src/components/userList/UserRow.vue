<template>
  <tr class="user-row text-center text-body-1 text--primary">
    <td class="first-capital">{{ $t(`roles.${user.role}`) }}</td>
    <td>
      <div class="d-flex align-center">
        <v-img
          :src="avatar(user.id, user.version)"
          :lazy-src="defAvatar"
          width="1.5rem"
          height="1.5rem"
          class="rounded-circle"
        />
        <div style="width: 100%">
          {{ user.username }}
        </div>
      </div>
    </td>
    <td class="hidden-sm-and-down ellipsis email">{{ user.email }}</td>
    <td class="d-flex justify-center align-center">
      <user-edit-button :user="user" :own-user="userId === user.id" @update="update" />
      <user-delete-button :user="user" :own-user="userId === user.id" @update="update" />
    </td>
  </tr>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

import Media from '@/api/Media';
import type { UserResponse } from '@/api/User';

import UserDeleteButton from './UserDeleteButton.vue';
import UserEditButton from './UserEditButton.vue';

@Component({
  components: { UserDeleteButton, UserEditButton },
})
export default class UserRow extends Vue {
  @Prop() readonly user!: UserResponse;

  defAvatar = Media.defaultAvatar;

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
