<template>
  <v-row align="center" class="ma-0 mb-2 pa-1 background rounded-lg">
    <v-col cols="12" sm="4">
      <v-text-field
        :value="filters.username"
        @input="updateFilter('username', $event)"
        clearable
        dense
        label="Username"
        hide-details
        :prepend-icon="icons.mdiMagnify"
        @click:prepend="useFilters()"
      />
    </v-col>
    <v-col cols="12" sm="4">
      <v-select
        :items="roleItems"
        :value="filters.role"
        label="Role"
        dense
        hide-details
        @input="updateFilter('role', $event)"
      />
    </v-col>
    <v-col cols="12" sm="4">
      <v-btn class="float-right" @click="useFilters()">Filter</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, VModel, Emit } from 'vue-property-decorator';
import { mdiMagnify } from '@mdi/js';
import type { UserFilters } from '@/api/User';

@Component
export default class UserFilter extends Vue {
  @VModel() filters!: UserFilters;

  icons = {
    mdiMagnify,
  };

  roleItems = [
    { value: null, text: '---' },
    { value: 'admin', text: 'Admin' },
    { value: 'uploader', text: 'Uploader' },
    { value: 'user', text: 'User' },
  ];

  updateFilter(field: string, value: any): void {
    const filters: Record<string, any> = { ...this.filters };
    filters[field] = value;
    this.filters = filters;
  }

  @Emit('update')
  useFilters(): boolean {
    return true;
  }
}
</script>
