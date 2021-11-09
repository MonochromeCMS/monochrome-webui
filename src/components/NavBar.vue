<template>
  <v-app-bar app flat color="backgroundAlt" :hide-on-scroll="reader">
    <router-link v-if="!settings.title1 && !settings.title2" to="/" class="logo lemon-milk">
      Mono<span class="text--secondary">chrome</span>
    </router-link>
    <router-link v-else to="/" class="logo lemon-milk">
      <span v-if="settings.title1" v-text="settings.title1" />
      <span v-if="settings.title2" v-text="settings.title2" class="text--secondary" />
    </router-link>

    <v-tabs centered class="hidden-sm-and-down" optional v-model="tabs">
      <v-tab v-for="link in links" :key="link.text" :to="link.to">
        {{ link.text }}
      </v-tab>
    </v-tabs>

    <v-list class="hidden-sm-and-down action-list">
      <locales-item />
      <v-list-item v-if="!isConnected" to="/login" active-class="fake-tab">{{
        $t('login')
      }}</v-list-item>
      <v-menu v-else offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-list-item v-on="on" v-bind="attrs" class="login-tab">{{
            displayUserRole
          }}</v-list-item>
        </template>

        <admin-actions :left="true" />
      </v-menu>
    </v-list>

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          tile
          color="primary"
          class="hidden-md-and-up ml-auto"
          v-on="on"
          v-bind="attrs"
          aria-label="Navigation menu"
        >
          <v-icon>{{ icons.mdiMenu }}</v-icon>
        </v-btn>
      </template>
      <v-list-item-group class="background lemon-milk" vertical>
        <v-list-item class="justify-end" v-for="link in links" :key="link.text" :to="link.to">
          {{ link.text }}
        </v-list-item>
        <locales-item />
        <v-list-item v-if="!isConnected" to="/login">{{ $t('login') }}</v-list-item>
        <v-menu v-else offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item v-on="on" v-bind="attrs" class="login-tab">
              {{ displayUserRole }}
            </v-list-item>
          </template>
          <admin-actions :left="true" />
        </v-menu>
      </v-list-item-group>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AdminActions from '@/components/AdminActions.vue';
import { mdiMenu } from '@mdi/js';
import type { Role } from '@/api/User';
import LocalesItem from '@/components/LocalesItem.vue';

@Component({
  components: { LocalesItem, AdminActions },
})
export default class NavBar extends Vue {
  icons = {
    mdiMenu,
  };

  tabs = null;

  get links(): any {
    return [
      {
        text: this.$t('home'),
        to: '/',
      },
      {
        text: this.$t('manga'),
        to: '/manga',
      },
      {
        text: this.$t('about'),
        to: '/about',
      },
    ];
  }

  get reader(): boolean {
    return this.$route.name === 'ChapterReader';
  }

  get isConnected(): boolean {
    return this.$store.getters.isConnected;
  }

  get userRole(): Role {
    return this.$store.getters.userRole;
  }

  get displayUserRole(): string {
    return this.$store.getters.displayUserRole;
  }

  get settings(): any {
    return this.$store.getters.settings;
  }
}
</script>

<style lang="scss">
.logo {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: max-content;
  width: calc(100vw - 3rem);
  font-size: 2em;
  text-decoration: none;
}
.action-list {
  display: flex;
  padding: 0 0 0 8px;
  height: inherit;
  margin: -4px -16px -4px 0;
  font-weight: 500;
  text-transform: uppercase;
  white-space: nowrap;
}
.fake-tab {
  &::before {
    background-color: transparent;
    opacity: 1 !important;
    transition: opacity 500ms ease-in;
  }
  &.theme--light::before {
    border-bottom: black 2px solid;
  }
  &.theme--dark::before {
    border-bottom: white 2px solid;
  }
}
</style>

<i18n locale="en" lang="yaml">
login: 'Login'
home: 'Home'
manga: 'Manga'
about: 'About'
</i18n>

<i18n locale="fr" lang="yaml">
login: 'Se connecter'
home: 'Accueil'
manga: 'Manga'
about: 'À propos'
</i18n>
