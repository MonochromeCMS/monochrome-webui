<template>
  <v-row class="ma-0">
    <v-col cols="12" class="pa-0">
      <v-btn text :width="width" :class="fit" class="d-block mb-3" @click="previousChapter">
        {{ $t("previousChapter") }}
      </v-btn>
    </v-col>
    <v-col v-for="index in length" :key="page(index)" :class="webtoon ? 'webtoon' : ''" cols="12">
      <v-img contain :class="fit" :width="width" :src="page(index)" :lazy-src="defaultImage">
        <template #placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate />
          </v-row>
        </template>
      </v-img>
    </v-col>
    <v-col cols="12" class="pa-0">
      <v-btn text :width="width" :class="fit" class="d-block mt-3" @click="nextChapter">
        {{ $t("nextChapter") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator"

import Media from "@/api/Media"

@Component
export default class VerticalReader extends Vue {
  @Prop(String) readonly mangaId!: string

  @Prop(String) readonly chapterId!: string

  @Prop(Number) readonly version!: number

  @Prop(Number) readonly length!: number

  @Prop(Boolean) readonly webtoon!: boolean

  defaultImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAFUlEQVQ4y2NgGAWjYBSMglEwCqgDAAZUAAFDhx+cAAAAAElFTkSuQmCC"

  @Emit("next")
  nextChapter() {
    return true
  }

  @Emit("previous")
  previousChapter() {
    return true
  }

  get fit(): string {
    return this.webtoon ? "mx-auto" : this.$store.getters.getFit
  }

  get width(): string {
    return !this.webtoon ? null : this.$store.getters.getWidth
  }

  page(index: number): string {
    return Media.page(this.mangaId, this.chapterId, index, this.version)
  }
}
</script>

<style lang="scss">
.webtoon {
  padding: 0;
}
.default {
  margin: auto;
  max-height: 150vh;
  max-width: 100%;
}
.width {
  width: 100%;
}
.height {
  height: calc(100vh - 5rem);
  margin: auto;
  max-width: 100%;
}
</style>

<i18n locale="en" lang="yaml">
previousChapter: "Previous chapter"
nextChapter: "Next chapter"
</i18n>

<i18n locale="fr" lang="yaml">
previousChapter: "Chapitre précédant"
nextChapter: "Chapitre suivant"
</i18n>
