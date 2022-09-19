<script setup lang="ts">
const settings = useSettings()

const logoLength = computed(
  () => settings.title1.length + settings.title2.length,
)

const dynamicLogoSize = computed(
  () =>
    `font-size: clamp(1rem, calc((100vw - 48px - 18px) / ${logoLength.value}), 2rem);`,
)
</script>

<template>
  <v-app-bar-title>
    <router-link to="/" class="logo lemon-milk" :style="dynamicLogoSize">
      <span class="text-secondary">{{ settings.title1 }}</span>
      <span class="text-primary">{{ settings.title2 }}</span>
    </router-link>
  </v-app-bar-title>
</template>

<style>
.logo {
  display: block;
  text-decoration: none;
}
</style>
