<template>
  <v-btn
    v-scroll="onScroll"
    fab
    elevation="0"
    v-bind="attrs"
    :class="scrollClass"
    color="background"
    style="z-index: 2"
    v-on="on"
  >
    <v-icon color="primary">{{ icons.mdiMenu }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { mdiMenu } from "@mdi/js"
import { Component, Prop, Vue } from "vue-property-decorator"
import { Scroll } from "vuetify/lib"

@Component({
  directives: { scroll: Scroll },
})
export default class ReaderMenuFab extends Vue {
  @Prop() readonly attrs!: any

  @Prop() readonly on!: any

  icons = {
    mdiMenu,
  }

  currentScroll = 0

  scrollClass = ""

  onScroll(ev: any): void {
    const newScroll = ev.target.scrollingElement.scrollTop

    this.scrollClass = newScroll > this.currentScroll ? "reader-button scrolling" : "reader-button"

    this.currentScroll = newScroll
  }
}
</script>

<style>
.reader-button {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
}

.scrolling {
  transform: translateY(5rem);
}
</style>
