<template>
  <v-list color="backgroundAlt">
    <v-subheader>Admin actions</v-subheader>
    <v-list-item-group v-model="selectedItem" color="primary">
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
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

  get items(): Item[] {
    const result: Item[] = [];
    if (Manga.canCreate(this.userRole))
      result.push({
        text: 'Create manga',
        to: '/manga/new',
      });

    result.push(
      User.canEdit(this.userRole)
        ? {
            text: 'Handle users',
            to: '/users',
          }
        : {
            text: 'My user',
            to: '/users/me',
          },
    );

    if (Settings.canEdit(this.userRole))
      result.push({
        text: 'Customize website',
        to: '/settings',
      });

    result.push(
      {
        text: 'Logout',
        to: '/logout',
      },
      {
        text: 'API Documentation',
        href: `${Base.prefix}/docs`,
        target: '_blank',
      },
    );

    return result;
  }
}
</script>
