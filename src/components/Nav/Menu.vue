<script setup lang="ts">
import { mdiMenu } from '@mdi/js'
import type { Link } from './Tabs.vue'

defineProps<{
  links: Link[]
}>()

const { t } = useI18n()
const auth = useAuth()
</script>

<template>
  <v-btn icon size="large" height="64" width="64" class="nav-btn">
    <v-icon :icon="mdiMenu" />
    <v-menu location="bottom" activator="parent">
      <v-list class="nav-list">
        <v-list-item
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :title="link.text"
        />
        <nav-lang-item />
        <v-list-item v-if="!auth.isConnected" :title="t('login')" to="/login" />

        <v-menu v-else location="bottom end">
          <template #activator="{ props }">
            <v-list-item :title="auth.displayUserRole" v-bind="props" />
          </template>
          <admin-actions class="nav-list" />
        </v-menu>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<style>
.nav-btn {
  border-radius: 0;
}
</style>
