<template>
  <v-btn
    v-scroll="onScroll"
    fab
    elevation="0"
    color="background"
    :class="scrollClass"
    class="theme-toggle"
    aria-label="Theme toggle"
    style="z-index: 2"
    @click="toggleTheme"
  >
    <v-icon color="primary" large>{{ icons.mdiLightbulb }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { mdiLightbulb } from "@mdi/js"
import { Component, Vue } from "vue-property-decorator"
import { Scroll } from "vuetify/lib"

@Component({
  directives: { scroll: Scroll },
})
export default class ThemeToggle extends Vue {
  icons = {
    mdiLightbulb,
  }

  currentScroll = 0

  scrollClass = ""

  toggleTheme(): void {
    const dark = !this.$vuetify.theme.dark
    window.localStorage.setItem("monochrome-dark", dark ? "1" : "0")
    this.$vuetify.theme.dark = dark
  }

  onScroll(ev: any): void {
    const newScroll = ev.target.scrollingElement.scrollTop

    this.scrollClass = newScroll > this.currentScroll ? "scrolling" : ""

    this.currentScroll = newScroll
  }

  mounted(): void {
    this.$vuetify.theme.dark = window.localStorage.getItem("monochrome-dark") === "1"
  }
}
</script>

<style lang="scss">
.theme-toggle {
  position: fixed;
  left: 1rem;
  bottom: 1rem;
}

.scrolling {
  transform: translateY(5rem);
}
</style>
