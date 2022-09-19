<script setup lang="ts">
defineProps<{
  height: number
  src: string
}>()
</script>

<template>
  <v-responsive :height="height" style="position: relative">
    <div class="parallax" :style="{ 'background-image': `url('${src}')` }" />
    <slot />
  </v-responsive>
</template>

<style lang="scss">
.parallax {
  /* Full height */
  height: 100%;
  width: 100%;
  position: absolute;

  /* Create the parallax scrolling effect */
  // background-attachment: fixed;
  background-position: center 25%;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
