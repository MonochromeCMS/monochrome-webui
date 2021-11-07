<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card rounded="lg" color="backgroundAlt" elevation="0">
          <v-card-title class="justify-center lemon-milk">MANGA</v-card-title>
          <manga-page />
          <v-divider v-if="canCreate" />
          <v-card-actions>
            <v-btn v-if="canCreate" class="my-2 mx-auto" to="/manga/new" color="background">
              {{ $t('addManga') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MangaPage from '@/components/MangaPage.vue';
import MangaAPI from '@/api/Manga';
import type { Role } from '@/api/User';

@Component({
  components: { MangaPage },
})
export default class Manga extends Vue {
  get userRole(): Role {
    return this.$store.getters.userRole;
  }

  get canCreate(): boolean {
    return this.$store.getters.isConnected && MangaAPI.canCreate(this.userRole);
  }
}
</script>

<i18n locale="en" lang="yaml">
addManga: 'Add a manga'
</i18n>

<i18n locale="en" lang="yaml">
addManga: 'Ajouter un manga'
</i18n>
