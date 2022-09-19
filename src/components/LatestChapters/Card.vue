<script setup lang="ts">
import type { DetailedChapterResponse } from '@/api/Chapter'
import type { ProgressTrackingSchema } from '@/api/Progress'

import { Media } from '@/api/Media'

const props = defineProps<{
  chapter: DetailedChapterResponse
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const { t } = useI18n()
const auth = useAuth()
const notifications = useNotifications()
const timeAgo = useAgo(new Date(props.chapter.uploadTime))

const read = computed(
  () => !!(props.chapter.tracking && props.chapter.tracking.read),
)

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
  <v-card
    color="background"
    class="chapter-card"
    :class="{ read }"
    :to="`/chapters/${chapter.id}`"
  >
    <v-row align="center" class="px-4 py-2">
      <v-col cols="3">
        <v-img
          :src="Media.cover(chapter.mangaId, chapter.manga.version)"
          max-height="7rem"
        />
      </v-col>
      <v-col cols="8" class="d-flex flex-column justify-center">
        <h2 class="text-subtitle-1 ellipsis">
          {{ chapter.manga.title }}
        </h2>
        <h3 class="text-subtitle-2 ellipsis">
          {{
            `${t("chapter")} ${chapter.number}${
              chapter.name ? ` - ${chapter.name}` : ""
            }`
          }}
        </h3>
        <h4 class="text-caption">
          {{ chapter.scanGroup }}
        </h4>
        <v-chip class="chip-tag capitalize">
          {{ timeAgo }}
        </v-chip>
      </v-col>
      <read-button
        v-if="auth.isConnected"
        :read="read"
        @input="setRead($event)"
      />
    </v-row>
  </v-card>
</template>

<style lang="scss">
.v-chip.chip-tag {
  margin-top: 0.2rem;
  max-width: max-content;
}

.chapter-card {
  position: relative;
  transition: 0.5 all;

  &.read {
    filter: grayscale(1);
    color: var(--v-secondary-base);
  }

  .read-btn {
    position: absolute;
    top: 2px;
    right: 0;
    margin: 0.2rem;
    z-index: 1;
    color: var(--v-secondary-base);
  }
}
</style>

<i18n locale="en" lang="yaml">
chapter: Chapter
readState: Read/Unread
</i18n>

<i18n locale="fr" lang="yaml">
chapter: Chapitre
readState: Lu/Non-lu
</i18n>
