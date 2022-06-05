<template>
  <div id="reader">
    <paged-reader-tabs v-model="currentPage" :amount="amountTabs" />
    <v-carousel v-model="currentPage" height="auto" hide-delimiters :continuous="false">
      <template #prev="{ on, attrs }">
        <button v-bind="attrs" class="reader-buttons" v-on="on">
          <v-icon size="3rem">{{ icons.left }}</v-icon>
        </button>
      </template>
      <template #next="{ on, attrs }">
        <button v-bind="attrs" class="reader-buttons" v-on="on">
          <v-icon size="3rem">{{ icons.right }}</v-icon>
        </button>
      </template>

      <paged-reader-delimiter-slide key="firstSlide" />
      <template v-for="index in amountTabs">
        <paged-reader-slide :key="index" :double="double" :pages="slidePages(index)" />
      </template>
      <paged-reader-delimiter-slide key="lastSlide" />
    </v-carousel>
  </div>
</template>

<script lang="ts">
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js"
import { Component, Prop, Vue, Watch } from "vue-property-decorator"

import Media from "@/api/Media"

@Component
export default class PagedReader extends Vue {
  @Prop(String) readonly mangaId!: string

  @Prop(String) readonly chapterId!: string

  @Prop(Number) readonly version!: number

  @Prop(Number) readonly length!: number

  @Prop(Boolean) readonly double!: boolean

  icons = {
    left: mdiChevronLeft,
    right: mdiChevronRight,
  }

  currentPage: number | null = null

  handleArrows(ev: KeyboardEvent): void {
    if (this.currentPage === null) {
      return
    }

    switch (ev.code) {
      case "KeyA":
      case "ArrowLeft":
        this.currentPage -= 1
        break
      case "KeyD":
      case "ArrowRight":
        this.currentPage += 1
    }
  }

  get reverse(): boolean {
    return !this.$store.getters.getDirection
  }

  get parity(): number {
    return this.$store.getters.getParity
  }

  get amountTabs(): number {
    return this.double ? Math.ceil((this.length + this.parity) / 2) : this.length
  }

  get urls(): (string | null)[] {
    let result: (string | null)[] = Array.from({ length: this.length }, this.page)

    if (this.double) {
      if (this.parity) {
        const tempResult: (string | null)[] = [null]
        result = tempResult.concat(result)
      }
      if (result.length % 2 !== 0) {
        result.push(null)
      }
    }

    return this.reverse ? result.reverse() : result
  }

  page(_: any, index: number) {
    return Media.page(this.mangaId, this.chapterId, index + 1, this.version)
  }

  slidePages(index: number) {
    if (this.double) {
      return this.urls.slice(2 * (index - 1), 2 * index)
    } else {
      return this.urls.slice(index - 1, index)
    }
  }

  @Watch("chapterId")
  onChapterChange(): void {
    this.currentPage = this.reverse ? this.amountTabs : 1
  }

  @Watch("reverse")
  onDirectionChange(): void {
    if (this.currentPage == null) {
      return
    }

    this.currentPage = this.amountTabs - this.currentPage + 1
  }

  @Watch("parity")
  onParityChange(value: boolean): void {
    if (this.currentPage == null) {
      return
    }

    switch (true) {
      case this.double && value && this.length % 2 === 0:
        this.currentPage += Number(this.reverse)
        break
      case this.double && this.length % 2 === 0:
        this.currentPage -= Number(this.reverse)
    }
  }

  @Watch("currentPage")
  onPageChange(value: number): void {
    switch (true) {
      case value === this.amountTabs + 1 && !this.reverse:
      case value === 0 && this.reverse:
        this.$emit("next", 1)
        break
      case value === this.amountTabs + 1 && this.reverse:
      case value === 0 && !this.reverse:
        this.$emit("previous", 1)
    }
  }

  @Watch("double")
  onDoubleChange(value: boolean): void {
    if (this.currentPage == null) {
      return
    }

    if (value) {
      this.currentPage = Math.ceil((this.currentPage + Number(this.reverse)) / 2)
    } else {
      this.currentPage = this.currentPage * 2 - 1
    }
  }

  mounted(): void {
    this.currentPage = this.reverse ? this.amountTabs : 1
    document.addEventListener("keyup", this.handleArrows)
  }
}
</script>

<style lang="scss">
#reader {
  .v-window__prev,
  .v-window__next {
    height: 100%;
    top: 0;
    border-radius: 0;
    margin: 0;
    background: none;
  }

  .reader-buttons {
    height: 100%;
    padding: 16px;

    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), visibility 0s;

    .v-icon {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 50%;
      opacity: 0.6;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.2);

      .v-icon {
        background-color: transparent;
        opacity: 1;
      }
    }
  }
}
</style>
