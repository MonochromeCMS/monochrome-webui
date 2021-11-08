<template>
  <v-list color="backgroundAlt">
    <v-subheader>
      <div class="capitalize">{{ $t('userActions', { role: displayUserRole }) }}</div>
    </v-subheader>
    <v-list-item-group v-model="selectedItem" color="primary">
      <v-list-item
        v-for="item in items"
        :key="item.text"
        :to="item.to"
        :href="item.href"
        :target="item.target"
      >
        <v-tooltip :right="!left" :left="left" open-delay="600">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item-content v-bind="attrs" v-on="on">
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </template>
          <span v-text="item.text"></span>
        </v-tooltip>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Base from '@/api/Base';
import type { Role } from '@/api/User';
import User from '@/api/User';
import Settings from '@/api/Settings';
import Manga from '@/api/Manga';

interface Item {
  text: string;
  to?: string;
  href?: string;
  target?: string;
}

@Component
export default class AdminActions extends Vue {
  @Prop(Boolean) readonly left!: boolean;

  selectedItem = null;

  get userRole(): Role {
    return this.$store.getters.userRole;
  }

  get displayUserRole(): string {
    return this.$store.getters.displayUserRole;
  }

  get items(): Item[] {
    const result: Item[] = [];
    if (Manga.canCreate(this.userRole))
      result.push({
        text: this.$tc('createManga'),
        to: '/manga/new',
      });

    result.push(
      User.canEdit(this.userRole)
        ? {
            text: this.$tc('handleUsers'),
            to: '/users',
          }
        : {
            text: this.$tc('myUser'),
            to: '/users/me',
          },
    );

    if (Settings.canEdit(this.userRole))
      result.push({
        text: this.$tc('customizeWebsite'),
        to: '/settings',
      });

    result.push(
      {
        text: this.$tc('logout'),
        to: '/logout',
      },
      {
        text: this.$tc('apiDocs'),
        href: `${Base.prefix}/docs`,
        target: '_blank',
      },
    );

    return result;
  }
}
</script>

<style>
.capitalize:first-letter {
  text-transform: uppercase;
}
</style>

<i18n locale="en" lang="yaml">
userActions: '{role} actions'
createManga: 'Create manga'
handleUsers: 'Handle users'
myUser: 'My user'
customizeWebsite: 'Customize website'
logout: 'Logout'
apiDocs: 'API Documentation'
</i18n>

<i18n locale="fr" lang="yaml">
userActions: "Actions d'{role}"
createManga: 'Ajouter un manga'
handleUsers: 'Gérer les utilisateurs'
myUser: 'Mon utilisateur'
customizeWebsite: 'Personaliser le site'
logout: 'Se déconnecter'
apiDocs: 'Documentation API'
</i18n>
