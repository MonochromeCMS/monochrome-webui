<script setup lang="ts">
export interface Link {
  text: string
  to: string
}

const props = defineProps<{
  links: Link[]
}>()

const route = useRoute()

const model = ref('/' as string | null)

const linkPaths = computed(() => props.links.map(l => l.to))

watchEffect(() => {
  if (!linkPaths.value.includes(route.path))
    model.value = null
})
</script>

<template>
  <v-tabs v-model="model" optional>
    <v-tab
      v-for="link in links"
      :key="link.text"
      :value="link.to"
      :to="link.to"
      :title="link.text"
      height="64"
    />
  </v-tabs>
</template>
