<script setup lang="ts">
import { mdiLightbulb } from '@mdi/js'
import { useTheme } from 'vuetify'
// TODO: scroll hide

const vTheme = useTheme()

const isDark = useDark({
  onChanged(isDark: boolean) {
    vTheme.global.name.value = isDark ? 'dark' : 'light'
  },
})
const toggleDark = useToggle(isDark)
</script>

<template>
  <v-btn
    icon
    color="background"
    variant="flat"
    size="large"
    aria-label="Theme toggle"
    class="theme-toggle"
    @click="toggleDark()"
  >
    <v-icon size="large" :icon="mdiLightbulb" />
  </v-btn>
</template>

<style lang="scss">
.theme-toggle {
  position: fixed !important;
  left: 1rem;
  bottom: 1rem;
  z-index: 2;
}
</style>
