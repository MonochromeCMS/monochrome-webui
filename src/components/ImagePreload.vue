<script setup lang="ts">
const props = defineProps<{
  src: string
  width?: string
}>()

const emits = defineEmits<{
  (e: 'visible'): void
}>()

const isLoading = ref(true)

function loaderIntersect(isIntersecting: boolean) {
  if (isIntersecting) {
    loadImage(props.src).then(() => {
      isLoading.value = false
    })
  }
}

function imageIntersect(isIntersecting: boolean) {
  if (isIntersecting)
    emits('visible')
}
</script>

<template>
  <v-responsive v-if="isLoading" v-intersect="loaderIntersect" :aspect-ratio="1" :width="width">
    <v-progress-circular class="d-block ma-auto h-100" indeterminate />
  </v-responsive>
  <v-responsive v-else :width="width">
    <img v-intersect="imageIntersect" :src="props.src" class="w-100 d-block">
  </v-responsive>
</template>
