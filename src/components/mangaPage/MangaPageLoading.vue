<template>
  <v-row>
    <v-col v-for="i in amount" :key="i" cols="12" sm="6" md="4" lg="3">
      <v-card color="background" height="100%" class="d-flex flex-column">
        <v-responsive aspect-ratio="1">
          <v-skeleton-loader type="image" class="skeleton-image fill-height" />
        </v-responsive>
        <v-skeleton-loader type="article, divider" />
        <v-skeleton-loader type="chip" class="skeleton-chip" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MangaPageLoading extends Vue {
  @Prop(Number) readonly amount!: number;
}
</script>

<style lang="scss">
.skeleton-chip .v-skeleton-loader__chip {
  margin: 0.5rem 0.5rem 0.5rem auto;
}

.skeleton-image .v-skeleton-loader__image {
  height: 100%;
}
</style>
