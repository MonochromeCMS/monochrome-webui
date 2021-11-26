<template>
  <div class="d-flex">
    <v-dialog v-model="deleteDialog" max-width="30rem">
      <v-card>
        <v-card-title class="text-h5 background mb-2">{{ $t('warning') }}</v-card-title>
        <v-card-text class="body-1">
          <span class="font-weight-bold">{{ $t('warningBoldMessage') }}</span>
          {{ $t('warningMessage') }}
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn color="gray" text @click="deleteDialog = false">{{ $t('cancel') }}</v-btn>
          <v-btn color="error" @click="deleteComment">
            {{ $t('delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn v-if="canEdit" tile icon class="hidden-sm-and-down" @click="edit">
      <v-icon>{{ icons.mdiPencil }}</v-icon>
    </v-btn>
    <v-btn v-if="canEdit" tile icon class="hidden-sm-and-down" @click.stop="deleteDialog = true">
      <v-icon>{{ icons.mdiDelete }}</v-icon>
    </v-btn>
    <v-btn v-if="canCreate" tile icon class="hidden-sm-and-down" @click="reply">
      <v-icon>{{ icons.mdiReply }}</v-icon>
    </v-btn>
    <v-menu v-if="canCreate || canEdit" offset-y>
      <template #activator="{ on, attrs }">
        <v-btn tile icon v-bind="attrs" class="hidden-md-and-up" v-on="on">
          <v-icon>{{ icons.mdiDotsVertical }}</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-if="canCreate" @click="reply">{{ $t('reply') }}</v-list-item>
        <v-list-item v-if="canEdit" @click="edit">{{ $t('edit') }}</v-list-item>
        <v-list-item v-if="canEdit" @click.stop="deleteDialog = true">{{
          $t('delete')
        }}</v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { mdiDelete, mdiDotsVertical, mdiPencil, mdiReply } from '@mdi/js';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CommentCardActions extends Vue {
  @Prop(Boolean) readonly canEdit!: boolean;

  @Prop(Boolean) readonly canCreate!: boolean;

  icons = { mdiDelete, mdiDotsVertical, mdiPencil, mdiReply };

  deleteDialog = false;

  @Emit('reply')
  reply(): boolean {
    return true;
  }

  @Emit('edit')
  edit(): boolean {
    return true;
  }

  @Emit('delete')
  deleteComment(): boolean {
    this.deleteDialog = false;
    return true;
  }
}
</script>

<i18n locale="en" lang="yaml">
warningMessage: 'Are you sure you want to delete this comment?'
reply: 'Reply'
edit: 'Edit'
</i18n>

<i18n locale="fr" lang="yaml">
warningMessage: 'Êtes-vous sûr de vouloir supprimer ce commentaire ?'
reply: 'Répondre'
edit: 'Modifier'
</i18n>
