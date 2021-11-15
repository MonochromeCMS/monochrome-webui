<template>
  <v-row align="center">
    <v-col cols="12" md="3">
      <v-skeleton-loader type="image" />
    </v-col>
    <v-col cols="12" md="9" class="d-flex flex-column justify-center">
      <v-skeleton-loader type="heading" class="mb" />
      <v-skeleton-loader type="chip, chip, chip" class="d-flex flex-wrap skeleton-tag" />
      <v-skeleton-loader type="text@3" class="mr-5" />
      <v-skeleton-loader type="button" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MangaRowLoading extends Vue {}
</script>

<style lang="scss">
.skeleton-tag .v-skeleton-loader__chip {
  margin: 0.3rem;
  span {
    font-weight: 700;
    margin-right: 0.2rem;
  }
}
</style>
