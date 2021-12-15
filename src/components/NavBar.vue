<template>
  <v-app-bar app flat color="backgroundAlt" :hide-on-scroll="reader">
    <router-link v-if="!settings.title1 && !settings.title2" to="/" class="logo lemon-milk">
      Mono<span class="text--secondary">chrome</span>
    </router-link>
    <router-link v-else to="/" class="logo lemon-milk" :style="dynamicLogoSize">
      <span v-if="settings.title1" v-text="settings.title1" />
      <span v-if="settings.title2" class="text--secondary" v-text="settings.title2" />
    </router-link>

    <v-tabs v-model="tabs" centered class="hidden-sm-and-down" optional>
      <v-tab v-for="link in links" :key="link.text" :to="link.to">
        {{ link.text }}
      </v-tab>
    </v-tabs>

    <v-list class="hidden-sm-and-down action-list">
      <locales-item />
      <v-list-item v-if="!isConnected" to="/login" active-class="fake-tab">
        {{ $t('login') }}
      </v-list-item>
      <v-menu v-else offset-y>
        <template #activator="{ on, attrs }">
          <v-list-item v-bind="attrs" class="login-tab" v-on="on">
            {{ displayUserRole }}
          </v-list-item>
        </template>

        <admin-actions :left="true" />
      </v-menu>
    </v-list>

    <v-menu offset-y>
      <template #activator="{ on, attrs }">
        <v-btn
          icon
          tile
          color="primary"
          class="hidden-md-and-up ml-auto"
          v-bind="attrs"
          aria-label="Navigation menu"
          v-on="on"
        >
          <v-icon>{{ icons.mdiMenu }}</v-icon>
        </v-btn>
      </template>
      <v-list-item-group class="background lemon-milk" vertical>
        <v-list-item v-for="link in links" :key="link.text" class="justify-end" :to="link.to">
          {{ link.text }}
        </v-list-item>
        <locales-item />
        <v-list-item v-if="!isConnected" to="/login">{{ $t('login') }}</v-list-item>
        <v-menu v-else offset-y>
          <template #activator="{ on, attrs }">
            <v-list-item v-bind="attrs" class="login-tab" v-on="on">
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
import { mdiMenu } from '@mdi/js';
import type { TranslateResult } from 'vue-i18n';
import { Component, Vue } from 'vue-property-decorator';

import type { SettingsSchema } from '@/api/Settings';
import type { Role } from '@/api/User';

interface Link {
  text: TranslateResult;
  to: string;
}

@Component
export default class NavBar extends Vue {
  icons = {
    mdiMenu,
  };

  tabs = null;

  get links(): Link[] {
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

  get settings(): SettingsSchema {
    return this.$store.getters.settings;
  }

  get dynamicLogoSize(): string {
    const length = (this.settings.title1?.length ?? 0) + (this.settings.title2?.length ?? 0);
    return `font-size: clamp(1em, calc((100vw - 48px - 18px) / ${length}), 2em);`;
  }
}
</script>

<style lang="scss">
.logo {
  display: block;
  font-size: clamp(1em, calc((100vw - 48px - 18px) / 10), 2em);
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
