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

@Component
export default class AdminActions extends Vue {
  @Prop(Boolean) readonly left!: boolean;

  selectedItem = null;

  items = [
    {
      text: 'Create manga',
      to: '/manga/new',
    },
    {
      text: 'Handle users',
      to: '/users',
    },
    {
      text: 'Customize website',
      to: '/settings',
    },
    {
      text: 'Logout',
      to: '/logout',
    },
    {
      text: 'API Documentation',
      href: `${Base.prefix}/docs`,
      target: '_blank',
    },
  ];
}
</script>