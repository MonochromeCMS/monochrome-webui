<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <hero-banner />
      </v-col>
      <v-col v-if="isConnected" lg="3" class="hidden-md-and-down">
        <v-sheet rounded="lg" color="backgroundAlt pa-1">
          <admin-actions :left="false" />
        </v-sheet>
      </v-col>

      <v-col cols="12" md="8" :lg="isConnected ? 5 : 8">
        <v-sheet rounded="lg" color="backgroundAlt">
          <latest-chapters />
        </v-sheet>
      </v-col>

      <v-col cols="12" md="4">
        <v-sheet rounded="lg" color="backgroundAlt">
          <latest-manga />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

@Component
export default class Home extends Vue {
  get isConnected(): boolean {
    return this.$store.getters.isConnected
  }
}
</script>
