<script setup lang="ts">
import { mdiDotsVertical } from '@mdi/js'

import type { ChapterResponse } from '@/api/Chapter'
import type { ProgressTrackingSchema } from '@/api/Progress'

const props = defineProps<{
  chapter: ChapterResponse
  showEdit: boolean
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()
const ago = useAgo(new Date(props.chapter.uploadTime))

const cols = computed(() => {
  if (auth.isConnected && props.showEdit) {
    return [
      [5, 4, 2, 2, 2], // Number
      [0, 0, 3, 3, 3], // Title
      [4, 2, 3, 3, 3], // Group
      [0, 3, 2, 2, 2], // Time Ago
      [3, 3, 2, 2, 2], // Buttons
    ]
  }
  else if (auth.isConnected || props.showEdit) {
    return [
      [5, 4, 2, 2, 2], // Number
      [0, 0, 4, 4, 4], // Title
      [5, 3, 3, 3, 3], // Group
      [0, 3, 2, 2, 2], // Time Ago
      [2, 2, 1, 1, 1], // Buttons
    ]
  }
  else {
    return [
      [6, 5, 3, 3, 3], // Number
      [0, 0, 4, 4, 4], // Title
      [6, 4, 3, 3, 3], // Group
      [0, 3, 2, 2, 2], // Time Ago
      [0, 0, 0, 0, 0], // Buttons
    ]
  }
})
const read = computed(() => !!(props.chapter.tracking && props.chapter.tracking[0] && props.chapter.tracking[0].read))

async function setRead(read: boolean) {
  const tracking: ProgressTrackingSchema = {
    chapterId: props.chapter.id,
    chapterVersion: props.chapter.version,
    page: read ? props.chapter.length : 0,
    read,
  }

  const response = await Progress.pushTracking(tracking, auth.config)

  if (response.data !== null)
    emits('update')
  else
    notifications.create('error', t('readState'), response.error)
}
</script>

<template>
  <v-col cols="12" class="chapter-row py-0" :class="{ read }">
    <router-link :to="`/chapters/${chapter.id}`">
      <v-row align="center" class="ma-0">
        <v-col :cols="cols[0][0]" :sm="cols[0][1]" :md="cols[0][2]">
          <span class="hidden-sm-and-down">
            {{ chapter.volume ? `Vol ${chapter.volume} ` : "" }}
          </span>
          {{ t("chapter") }}
          {{ chapter.number }}
        </v-col>
        <v-col :md="cols[1][2]" class="hidden-sm-and-down ellipsis">
          {{ chapter.name }}
        </v-col>
        <v-col :cols="cols[2][0]" :sm="cols[2][1]" :md="cols[2][2]" class="ellipsis text-center">
          {{ chapter.scanGroup }}
        </v-col>
        <v-col :sm="cols[3][1]" :md="cols[3][2]" class="pa-0 text-right hidden-xs-only">
          <v-chip variant="outlined" color="primary" class="ma-2">
            {{ ago }}
          </v-chip>
        </v-col>
        <v-col
          v-if="auth.isConnected || showEdit"
          :cols="cols[4][0]"
          :sm="cols[4][1]"
          :md="cols[4][2]"
          class="d-flex justify-end"
        >
          <read-button v-if="auth.isConnected" :read="read" @input="setRead($event)" />
          <v-btn variant="text" icon size="small" aria-label="More options" @click.prevent="">
            <v-icon :icon="mdiDotsVertical" />
            <v-menu v-if="showEdit" activator="parent">
              <v-btn block color="background" :to="`/chapters/${chapter.id}/edit`">
                {{ t("editChapter") }}
              </v-btn>
              <manga-chapters-delete :chapter-id="chapter.id" @delete="emits('update')" />
            </v-menu>
          </v-btn>
        </v-col>
      </v-row>
    </router-link>
  </v-col>
</template>

<style lang="scss">
  .chapter-row {
    background-color: rgb(var(--v-theme-backgroundAlt));

    + .chapter-row {
      border-top: 1px solid rgb(var(--v-theme-secondary));
    }

    &:hover {
      background-color: rgb(var(--v-theme-background));
    }

    a {
      display: block;

      color: rgb(var(--v-theme-primary));
      text-decoration: none;
    }

    &.read a {
      color: rgb(var(--v-theme-secondary));
    }
  }
</style>

<i18n locale="en" lang="yaml">
chapter: Chapter
editChapter: Edit chapter
</i18n>

<i18n locale="fr" lang="yaml">
chapter: Chapitre
editChapter: Modifier chapitre
</i18n>
