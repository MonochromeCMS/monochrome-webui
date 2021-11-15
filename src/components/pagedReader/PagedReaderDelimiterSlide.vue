<template>
  <v-carousel-item>
    <v-row align="center" justify="center" style="height: calc(100vh - 8rem)">
      <v-progress-circular indeterminate />
    </v-row>
  </v-carousel-item>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class PagedReaderDelimiterSlide extends Vue {}
</script>
