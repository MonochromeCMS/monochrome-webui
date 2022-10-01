<script setup lang="ts">
const props = defineProps<{
  height: number
  src: string
}>()

const bg = computed(() => `url("${props.src}")`)

const el = ref(null)
const { y } = useElementBounding(el)
const translate = computed(() => `translateY(${-y.value}px)`)
</script>

<template>
  <v-responsive ref="el" :height="height" style="position: relative">
    <div class="parallax" :style="{ 'background-image': bg, 'transform': translate }" />
    <slot />
  </v-responsive>
</template>

<style lang="scss">
.parallax {
  /* The full viewport height so that it can scroll all the way */
  height: 100vh;
  width: 100%;
  position: absolute;

  /* Center and scale the image nicely */
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
