<script setup lang="ts">
const props = defineProps<{
  next: string | null
  prev: string | null
  position: 'prev' | 'next'
}>()

const { t } = useI18n()
const chapterId = useRouteSingleParam('chapterId')

function onIntersect(isIntersecting: boolean) {
  if (isIntersecting) {
    if (props.position === 'prev' && props.prev)
      chapterId.value = props.prev
    else if (props.position === 'next' && props.next)
      chapterId.value = props.next
  }
}

const linkExists = computed(() => props.position === 'prev' ? !!props.prev : !!props.next)
</script>

<template>
  <v-row>
    <v-col cols="12" class="mx-auto">
      <v-responsive min-height="30rem">
        <div class="d-flex h-100">
          <v-card v-if="!linkExists" class="ma-auto">
            <v-card-title>
              {{ position === 'prev' ? t('firstChapter') : t('lastChapter') }}
            </v-card-title>
          </v-card>
          <v-progress-circular v-else v-intersect="onIntersect" class=" d-block ma-auto" indeterminate />
        </div>
      </v-responsive>
    </v-col>
  </v-row>
</template>

<i18n locale="en" lang="yaml">
firstChapter: This is the first chapter
lastChapter: This is the last chapter
</i18n>

<i18n locale="fr" lang="yaml">
firstChapter: 'C''est le premier chapitre'
lastChapter: 'C''est le dernier chapitre'
</i18n>
