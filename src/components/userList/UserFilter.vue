<template>
  <v-row align="center" class="ma-0 mb-2 pa-1 background rounded-lg">
    <v-col cols="12" sm="4">
      <v-text-field
        :value="filters.username"
        clearable
        dense
        :label="$t('username')"
        hide-details
        :prepend-icon="icons.mdiMagnify"
        @input="updateFilter('username', $event)"
        @click:prepend="useFilters()"
      />
    </v-col>
    <v-col cols="12" sm="4">
      <v-select
        :items="roleItems"
        :value="filters.role"
        :label="$t('role')"
        dense
        hide-details
        @input="updateFilter('role', $event)"
      />
    </v-col>
    <v-col cols="12" sm="4">
      <v-btn class="float-right" @click="useFilters()">{{ $t("filter") }}</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { mdiMagnify } from "@mdi/js"
import { Component, Emit, VModel, Vue } from "vue-property-decorator"

import type { Role, UserFilters } from "@/api/User"

@Component
export default class UserFilter extends Vue {
  @VModel() filters!: UserFilters

  icons = {
    mdiMagnify,
  }

  roleItems = [
    { text: "---", value: null },
    { text: this.upper(this.$tc("roles.admin")), value: "admin" },
    { text: this.upper(this.$tc("roles.uploader")), value: "uploader" },
    { text: this.upper(this.$tc("roles.user")), value: "user" },
  ]

  updateFilter(field: string, value: string | Role): void {
    const filters: Record<string, any> = { ...this.filters }
    filters[field] = value
    this.filters = filters
  }

  upper(str: string): string {
    return str ? str[0].toUpperCase() + str.slice(1) : ""
  }

  @Emit("update")
  useFilters(): boolean {
    return true
  }
}
</script>

<i18n locale="en" lang="yaml">
username: "Username"
role: "Role"
filter: "Filter"
</i18n>

<i18n locale="fr" lang="yaml">
username: "Nom d'utilisateur"
role: "Rôle"
filter: "Filtrer"
</i18n>
