<template>
  <v-container>
    <v-row v-if="loading" class="flex-column align-center">
      <v-col cols="12" class="text-h3 text-center" tag="h2">{{ $t('chapters') }}</v-col>
      <v-col v-for="i in limit" :key="i">
        <v-row class="justify-space-around background">
          <v-col cols="7" sm="4" md="3">
            <v-skeleton-loader type="heading" />
          </v-col>
          <v-col cols="3" md="4" class="hidden-sm-and-down">
            <v-skeleton-loader type="heading" />
          </v-col>
          <v-col cols="5" sm="3" md="2">
            <v-skeleton-loader type="heading" />
          </v-col>
          <v-col cols="3" lg="2" class="pa-0 text-right hidden-xs-only">
            <v-skeleton-loader type="chip" class="ma-2" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-else class="flex-column align-center">
      <v-col cols="12" class="text-h3 text-center" tag="h2">{{ $t('chapters') }}</v-col>
      <v-col
        cols="12"
        v-for="(item, index) in chaptersPage"
        :key="item.id"
        class="chapter-row pa-1"
      >
        <router-link :to="`/chapters/${item.id}`" class="text-decoration-none chapter-link pa-3">
          <v-row class="justify-space-around">
            <v-col cols="6" sm="3" md="2">
              {{ item.volume ? `Vol ${item.volume} ` : '' }}{{ $t('chapter') }}
              {{ item.number }}
            </v-col>
            <v-col cols="3" md="4" class="hidden-sm-and-down ellipsis">
              {{ item.name }}
            </v-col>
            <v-col cols="6" sm="4" md="3" class="ellipsis">
              {{ item.scanGroup }}
            </v-col>
            <v-col cols="3" lg="2" class="pa-0 text-right hidden-xs-only">
              <v-chip color="backgroundAlt" class="ma-2">
                {{ $t('timeAgo', { time: ago(new Date(item.uploadTime).getTime()) }) }}
              </v-chip>
            </v-col>
          </v-row>
        </router-link>
        <v-menu v-if="canEdit(item)" offset-y close-on-content-click>
          <template v-slot:activator="{ on, attrs }">
            <v-btn tile icon v-on="on" v-bind="attrs" class="mr-1" aria-label="More options">
              <v-icon>{{ icons.mdiDotsVertical }}</v-icon>
            </v-btn>
          </template>
          <v-btn block color="background" :to="`/chapters/${item.id}/edit`">{{
            $t('editChapter')
          }}</v-btn>
          <chapter-delete :id="item.id" @input="popChapter(index)" />
        </v-menu>
      </v-col>
      <v-col cols="12" class="text-body-1 text-center" v-if="chapters.length === 0">
        {{ $t('noChapters') }}
      </v-col>
      <v-col cols="12" v-if="pageAmount > 1">
        <v-pagination
          class="mx-auto"
          color="background text--primary"
          v-model="page"
          :length="pageAmount"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, VModel } from 'vue-property-decorator';
import ChapterDelete from '@/components/ChapterDelete.vue';
import Manga from '@/api/Manga';
import Chapter from '@/api/Chapter';
import { mdiDotsVertical } from '@mdi/js';
import type { ChapterResponse } from '@/api/Chapter';
import type { Role } from '@/api/User';

@Component({
  components: { ChapterDelete },
})
export default class MangaChapters extends Vue {
  @Prop() readonly mangaId!: string;

  @VModel({ type: String }) firstChapter!: string;

  icons = {
    mdiDotsVertical,
  };

  chapters: ChapterResponse[] = [];

  loading = true;

  limit = 10;

  page = 1;

  get pageAmount(): number {
    return Math.ceil(this.chapters.length / this.limit);
  }

  get chaptersPage(): any[] {
    const start = this.limit * (this.page - 1);
    return this.chapters.slice(start, start + this.limit);
  }

  get userId(): string {
    return this.$store.getters.userId;
  }

  get userRole(): Role {
    return this.$store.getters.userRole;
  }

  canEdit(chapter: ChapterResponse): boolean {
    return Chapter.canEdit(chapter, this.userId, this.userRole);
  }

  popChapter(index: number): void {
    this.chapters.splice(index, 1);
  }

  async getChapters(): Promise<void> {
    const response = await Manga.chapters(this.mangaId, this.loading);

    if (response.data) {
      this.chapters = response.data;
      this.loading = false;
    } else {
      const notification = {
        context: this.$t('mangaChapters'),
        message: response.error ?? '',
        color: 'error',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
  }

  ago(val: number): string {
    val = 0 | ((Date.now() - val) / 1000);
    const length: Record<string, number> = {
      second: 60,
      minute: 60,
      hour: 24,
      day: 7,
      week: 4.35,
      month: 12,
      year: 10000,
    };

    for (const unit of Object.keys(length)) {
      const result = val % length[unit];
      if (!(val = 0 | (val / length[unit]))) return this.$tc(`timeUnits.${unit}`, result);
    }
    return 'ERROR';
  }

  @Watch('chapters')
  onChaptersUpdate(): void {
    if (this.chapters.length > 0) {
      this.firstChapter = this.chapters[this.chapters.length - 1].id;
    }
  }

  mounted(): void {
    this.getChapters();
  }
}
</script>

<style lang="scss">
.chapter-row {
  display: flex;
  align-items: center;
  .chapter-link {
    width: 100%;
    height: 100%;
  }
}
.theme--dark {
  .chapter-row {
    background-color: black;
    &:hover {
      background-color: #424242;
    }
    border-bottom: #212121 0.1rem solid;
    &:last-child {
      border-bottom: none;
    }
  }
}
.theme--light {
  .chapter-row {
    background-color: #eeeeee;
    &:hover {
      background-color: #e0e0e0;
    }
    border-bottom: #ffffff 0.1rem solid;
    &:last-child {
      border-bottom: none;
    }
  }
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<i18n locale="en" lang="yaml">
chapters: 'Chapters'
chapter: 'Chapter'
editChapter: 'Edit chapter'
mangaChapters: 'Manga chapters'
</i18n>

<i18n locale="fr" lang="yaml">
chapters: 'Chapitres'
chapter: 'Chapitre'
editChapter: 'Modifier chapitre'
mangaChapters: 'Chapitres du manga'
</i18n>
