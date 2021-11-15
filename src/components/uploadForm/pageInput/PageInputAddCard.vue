<template>
  <v-card color="background" :disabled="loading" @click="uploadClick">
    <v-responsive :aspect-ratio="4 / 5">
      <div class="d-flex fill-height">
        <v-progress-circular
          v-if="loading"
          :indeterminate="progress === 100"
          :value="progress"
          class="ma-auto d-block"
        />
        <v-icon v-else x-large class="ma-auto d-block">{{ icons.mdiPlus }}</v-icon>
      </div>
    </v-responsive>
    <input ref="fileInput" type="file" multiple style="display: none" @input="updateFile" />
  </v-card>
</template>

<script lang="ts">
import { mdiPlus } from '@mdi/js';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';

@Component
export default class PageInputAddCard extends Vue {
  @Ref() readonly fileInput!: HTMLInputElement;

  @Prop(Boolean) readonly loading!: boolean;

  @Prop(Number) readonly progress!: number;

  icons = {
    mdiPlus,
  };

  @Emit('fileUpload')
  updateFile(event: any): any {
    return event;
  }

  uploadClick(): void {
    this.fileInput.click();
  }
}
</script>
