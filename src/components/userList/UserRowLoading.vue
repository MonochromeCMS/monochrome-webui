<template>
  <tr class="user-row">
    <td v-for="h in headersAmount - 2" :key="h">
      <v-skeleton-loader type="heading" class="d-flex justify-center" />
    </td>
    <td class="hidden-sm-and-down">
      <v-skeleton-loader type="heading" class="d-flex justify-center" />
    </td>
    <td>
      <v-skeleton-loader
        width="150px"
        type="button,button"
        class="d-flex justify-space-around mx-auto"
      />
    </td>
  </tr>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"

@Component
export default class UsersRowLoading extends Vue {
  @Prop(Number) readonly headersAmount!: number
}
</script>
