<template>
  <v-carousel-item>
    <div v-if="double" class="d-flex justify-center">
      <v-img v-if="pages[0]" :class="`${fit} half-page left`" contain :src="pages[0]">
        <template #placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate />
          </v-row>
        </template>
      </v-img>
      <v-img v-if="pages[1]" :class="`${fit} half-page right`" contain :src="pages[1]">
        <template #placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate />
          </v-row>
        </template>
      </v-img>
    </div>
    <v-img v-else :class="fit" contain :src="pages[0]">
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate />
        </v-row>
      </template>
    </v-img>
  </v-carousel-item>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class PagedReaderSlide extends Vue {
  @Prop(Boolean) readonly double!: boolean;

  @Prop() readonly pages!: string[];

  get fit(): string {
    return this.$store.getters.getFit;
  }
}
</script>

<style lang="scss">
.half-page {
  &.left .v-image__image {
    background-position: right center !important;
  }
  &.right .v-image__image {
    background-position: left center !important;
  }
}
.default {
  max-height: 150vh;
  max-width: 100%;
  &.half-page {
    max-width: 50%;
  }
}
.width {
  width: 100%;
  &.half-page {
    width: 50%;
  }
}
.height {
  max-height: calc(100vh - 5rem);
  max-width: 100%;
  &.half-page {
    max-width: 50%;
  }
}
</style>
