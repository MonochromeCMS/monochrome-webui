<template>
  <v-card color="background" class="page-card">
    <v-img :src="blob" :aspect-ratio="4 / 5" position="relative">
      <v-btn
        icon
        :disabled="disabled"
        class="background text--primary page-close"
        @click="deletePage"
      >
        <v-icon>{{ icons.mdiClose }}</v-icon>
      </v-btn>
      <v-chip class="page-name">{{ page.name }}</v-chip>
    </v-img>
  </v-card>
</template>

<script lang="ts">
import { mdiClose } from '@mdi/js';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

import Media from '@/api/Media';
import type { UploadedBlobResponse } from '@/api/Upload';

@Component
export default class PageInputCard extends Vue {
  @Prop() readonly page!: UploadedBlobResponse;

  @Prop(Boolean) readonly disabled!: boolean;

  icons = {
    mdiClose,
  };

  get blob(): string {
    return Media.blob(this.page.id);
  }

  @Emit('delete')
  deletePage(): boolean {
    return true;
  }
}
</script>

<style scoped>
.page-card {
  cursor: grab;
}
.page-name {
  position: absolute;
  bottom: 0.1rem;
  left: 0.1rem;
}
.page-close {
  position: absolute;
  right: 0.1rem;
  top: 0.1rem;
}
</style>
