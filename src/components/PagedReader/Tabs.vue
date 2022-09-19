<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  amount: number
  direction: boolean | number
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const { t } = useI18n()

const currentPage = useVModel(props, 'modelValue', emits)
</script>

<template>
  <v-tabs
    v-model="currentPage"
    bg-color="backgroundAlt"
    class="reader-tabs"
    center-active
    show-arrows
    centered
  >
    <v-tab :key="0">
      {{ direction ? t("previousChapter") : t("nextChapter") }}
    </v-tab>
    <v-tab v-for="index in amount" :key="index">
      {{ direction ? index : amount - index + 1 }}
    </v-tab>
    <v-tab :key="amount + 1">
      {{ direction ? t("nextChapter") : t("previousChapter") }}
    </v-tab>
  </v-tabs>
</template>

<style lang="scss">
.reader-tabs {
  position: sticky;
  top: 80px;
  z-index: 1;
  border-radius: 0.3rem;
  margin-bottom: 0.8rem;
  transition-duration: 0.28s;
  transition-property: box-shadow, transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.tabs-scrolling {
  transform: translateY(-64px);

  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
}
</style>

<i18n locale="en" lang="yaml">
nextChapter: Next chapter
previousChapter: Previous chapter
</i18n>

<i18n locale="fr" lang="yaml">
nextChapter: Chapitre suivant
previousChapter: Chapitre précédent
</i18n>
