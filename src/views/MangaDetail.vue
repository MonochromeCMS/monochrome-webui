<template>
  <v-container>
    <v-row>
      <v-col>
        <v-sheet rounded="lg" color="backgroundAlt">
          <v-container>
            <manga-row :loading="loading" :manga="manga" :cover="cover || ''">
              <div class="d-flex flex-wrap">
                <v-btn
                  v-if="firstChapter"
                  :to="`/chapters/${firstChapter}`"
                  color="background"
                  class="ma-2"
                >
                  {{ $t('startReading') }}
                </v-btn>
                <v-btn
                  v-if="canUpload"
                  :to="`/manga/${mangaId}/upload`"
                  color="green darken-2"
                  class="ma-2"
                >
                  {{ $t('addChapter') }}
                </v-btn>
                <v-btn
                  v-if="canEdit(manga)"
                  :to="`/manga/${mangaId}/edit`"
                  color="info"
                  class="ma-2"
                >
                  {{ $t('editManga') }}
                </v-btn>
                <v-dialog v-if="canEdit(manga)" v-model="deleteDialog" max-width="30rem">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="error" v-bind="attrs" v-on="on" class="ma-2">
                      {{ $t('deleteManga') }}
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="text-h5 background mb-2">{{ $t('warning') }}</v-card-title>

                    <v-card-text class="body-1">
                      <span class="font-weight-bold">{{ $t('warningBoldMessage') }}</span>
                      {{ $t('warningMessage') }}
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="gray" text @click="deleteDialog = false">{{
                        $t('cancel')
                      }}</v-btn>
                      <v-btn color="error" @click="deleteManga">{{ $t('delete') }}</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </manga-row>
            <manga-chapters :manga-id="mangaId" v-model="firstChapter" />
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MangaRow from '@/components/MangaRow.vue';
import MangaChapters from '@/components/MangaChapters.vue';
import Manga from '@/api/Manga';
import Media from '@/api/Media';
import type { AxiosRequestConfig } from 'axios';
import type { MangaResponse } from '@/api/Manga';
import type { Role } from '@/api/User';
import Chapter from '@/api/Chapter';

@Component({
  components: { MangaChapters, MangaRow },
})
export default class MangaDetail extends Vue {
  manga: MangaResponse | null = null;

  loading = true;

  firstChapter = '';

  deleteDialog = false;

  get mangaId(): string {
    return this.$route.params.manga;
  }

  get cover(): string | null {
    if (this.manga) {
      return Media.cover(this.manga.id, this.manga.version);
    }
    return null;
  }

  get userRole(): Role {
    return this.$store.getters.userRole;
  }

  get userId(): Role {
    return this.$store.getters.userId;
  }

  get canUpload(): boolean {
    return this.$store.getters.isConnected && Chapter.canCreate(this.userRole);
  }

  canEdit(manga: MangaResponse | null): boolean {
    return (
      manga && this.$store.getters.isConnected && Manga.canEdit(manga, this.userId, this.userRole)
    );
  }

  get authConfig(): AxiosRequestConfig {
    return this.$store.getters.authConfig;
  }

  async getManga(): Promise<void> {
    const response = await Manga.get(this.mangaId, this.loading);

    if (response.data) {
      this.manga = response.data;
    } else {
      const notification = {
        context: 'Get manga',
        message: response.error ?? '',
        color: 'error',
      };
      await this.$store.dispatch('pushNotification', notification);
    }

    this.loading = false;
  }

  async deleteManga(): Promise<void> {
    const config = this.authConfig;
    const response = await Manga.delete(this.mangaId, config);

    if (response.data || response.status === 404) {
      await this.$router.push('/manga');
    } else {
      const notification = {
        context: 'Delete manga',
        message: response.error ?? '',
        color: 'error',
      };
      await this.$store.dispatch('pushNotification', notification);
    }
    if (response.status === 401) {
      this.$store.commit('logout');
    }

    this.deleteDialog = false;
  }

  mounted(): void {
    this.getManga();
  }
}
</script>

<i18n locale="en" lang="yaml">
startReading: 'Start reading'
addChapter: 'Add a chapter'
editManga: 'Edit manga'
deleteManga: 'Delete manga'
warningMessage: 'Are you sure you want to delete this manga?'
</i18n>

<i18n locale="fr" lang="yaml">
startReading: 'Commencer à lire'
addChapter: 'Ajouter un chapitre'
editManga: 'Modifier le manga'
deleteManga: 'Supprimer le manga'
warningMessage: 'Êtes-vous sûr de vouloir supprimer ce manga?'
</i18n>
