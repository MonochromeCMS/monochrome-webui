<script setup lang="ts">
const auth = useAuth()
</script>

<template>
  <suspense>
    <template #fallback>
      <suspense-fallback />
    </template>

    <v-container>
      <v-row>
        <v-col cols="12">
          <hero-banner />
        </v-col>

        <v-col v-if="auth.isConnected" lg="2" class="hidden-md-and-down">
          <v-card color="backgroundAlt" flat>
            <v-card-text class="pa-0">
              <admin-actions :left="false" />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="8" :lg="auth.isConnected ? 6 : 8">
          <v-card color="backgroundAlt" flat>
            <latest-chapters />
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card color="backgroundAlt" flat>
            <latest-manga />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </suspense>
</template>
