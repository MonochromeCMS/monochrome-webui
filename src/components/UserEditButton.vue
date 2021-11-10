<template>
  <v-dialog v-model="dialog" max-width="30rem">
    <template #activator="{ on, attrs }">
      <v-btn class="mx-2" width="3rem" color="info" v-bind="attrs" aria-label="Edit user" v-on="on">
        <v-icon>{{ icons.mdiPencil }}</v-icon>
      </v-btn>
    </template>
    <user-form :user="user" :own-user="ownUser" @close="dialog = false" @update="update" />
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import UserForm from './UserForm.vue';
import { mdiPencil } from '@mdi/js';

@Component({
  components: { UserForm },
})
export default class UserEditButton extends Vue {
  @Prop() readonly user!: any;

  @Prop(Boolean) readonly ownUser!: boolean;

  icons = {
    mdiPencil,
  };

  dialog = false;

  @Emit('update')
  update(): boolean {
    return true;
  }
}
</script>
