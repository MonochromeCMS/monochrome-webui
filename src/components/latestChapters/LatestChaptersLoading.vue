<template>
  <v-row class="mx-0 mb-0">
    <v-col
      v-for="index in amount"
      :key="index"
      cols="12"
      sm="6"
      :lg="12 / columns"
      xl="6"
      class="px-2 my-2"
    >
      <v-card color="background" class="px-4">
        <v-row align="center">
          <v-col cols="3">
            <v-responsive max-height="7rem">
              <v-skeleton-loader type="image" />
            </v-responsive>
          </v-col>
          <v-col cols="8" class="d-flex flex-column justify-center">
            <h2>
              <v-skeleton-loader type="text" />
            </h2>
            <h3>
              <v-skeleton-loader type="text" />
            </h3>
            <h4>
              <v-skeleton-loader type="text" />
            </h4>
            <v-skeleton-loader type="chip" />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"

@Component
export default class LatestChaptersLoading extends Vue {
  @Prop(Number) readonly amount!: number

  @Prop(Number) readonly columns!: number
}
</script>
