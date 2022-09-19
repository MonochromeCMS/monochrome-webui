<script setup lang="ts">
const { locale } = useI18n()

const langStore = useLangs()

const availableLangs = computed(() =>
  langStore.langs.filter(v => v !== langStore.currentLang),
)

function setLang(lang: string) {
  langStore.currentLang = lang
  locale.value = lang
}
</script>

<template>
  <v-menu v-if="langStore.langs.length > 1" location="bottom end">
    <template #activator="{ props }">
      <v-list-item id="lang-item" v-bind="props">
        <v-list-item-title>{{ langStore.currentLang }}</v-list-item-title>
      </v-list-item>
    </template>
    <v-list class="nav-list">
      <v-list-item
        v-for="lang in availableLangs"
        :key="lang"
        @click="setLang(lang)"
      >
        <v-list-item-title>{{ lang }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
