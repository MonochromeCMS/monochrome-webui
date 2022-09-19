<script setup lang="ts">
const props = defineProps<{
  pages: (string | null)[]
}>()

const double = computed(() => !!(props.pages[0] && props.pages[1]))

const reader = useReader()
</script>

<template>
  <div v-if="double" class="d-flex justify-center">
    <v-img v-if="pages[0]" class="half-page left" :class="reader.fit" :src="pages[0]">
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate />
        </v-row>
      </template>
    </v-img>
    <v-img v-if="pages[1]" class="half-page right" :class="reader.fit" :src="pages[1]">
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate />
        </v-row>
      </template>
    </v-img>
  </div>
  <v-img v-else :class="reader.fit" :src="pages[0] || pages[1] || ''">
    <template #placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular indeterminate />
      </v-row>
    </template>
  </v-img>
</template>

<style lang="scss">
  .half-page {
    &.left .v-img__img--contain {
      object-position: center right;
    }
    &.right .v-img__img--contain {
      object-position: center left;
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
