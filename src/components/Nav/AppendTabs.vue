<script setup lang="ts">
const { t } = useI18n()

const auth = useAuth()
</script>

<template>
  <v-list class="append-tabs nav-list">
    <nav-lang-item />
    <v-list-item v-if="!auth.isConnected" :title="t('login')" to="/login" />

    <v-menu v-else location="bottom end">
      <template #activator="{ props }">
        <v-list-item :title="auth.displayUserRole" v-bind="props" />
      </template>
      <admin-actions class="nav-list" />
    </v-menu>
  </v-list>
</template>

<style lang="scss">
.append-tabs {
  display: flex;
  margin: -16px 0 -16px 0;
  height: 64px;
  padding: 0 !important;

  & > .v-list-item--active {
    padding-top: 6px !important;
    border-bottom: 2px solid rgb(var(--v-theme-primary));
    & > .v-list-item__overlay {
      opacity: 0;
    }
  }
}
</style>
