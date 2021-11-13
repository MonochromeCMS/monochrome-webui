<template>
  <v-row class="flex-column align-center">
    <v-col cols="12" class="text-h3 text-center" tag="h2">{{ $t('chapters') }}</v-col>
    <v-col v-for="i in amount" :key="i">
      <v-row class="justify-space-around background">
        <v-col cols="7" sm="4" md="3">
          <v-skeleton-loader type="heading" />
        </v-col>
        <v-col cols="3" md="4" class="hidden-sm-and-down">
          <v-skeleton-loader type="heading" />
        </v-col>
        <v-col cols="5" sm="3" md="2">
          <v-skeleton-loader type="heading" />
        </v-col>
        <v-col cols="3" lg="2" class="pa-0 text-right hidden-xs-only">
          <v-skeleton-loader type="chip" class="ma-2" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MangaChaptersLoading extends Vue {
  @Prop(Number) readonly amount!: number;
}
</script>
