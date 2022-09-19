<script setup lang="ts">
import type { ApiResponseFail } from '@/api/Base'
import type { UserResponse } from '@/api/User'

const router = useRouter()
const auth = useAuth()
const error = ref(null as ApiResponseFail | null)

const user = ref(null as UserResponse | null)

async function getMe() {
  const response = await User.me(auth.config)

  if (response.data !== null) {
    user.value = response.data
    auth.updateUser(response.data)
  }
  else {
    error.value = response
  }
}

const goBack = () => router.back()

onMounted(getMe)
</script>

<template>
  <error-container v-if="error" :error="error" />
  <v-container v-else class="fill-height">
    <v-row class="h-100">
      <v-col cols="12" md="10" lg="8" class="ma-auto">
        <user-form
          v-if="user"
          color="backgroundAlt"
          :own-user="true"
          :user="user"
          @close="goBack"
          @update="getMe()"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<i18n locale="en" lang="yaml">
getManga: Get my user
</i18n>

<i18n locale="fr" lang="yaml">
getManga: Chargement de mon utilisateur
</i18n>

<route lang="yaml">
meta:
  needsAuth: true
</route>
