<script setup lang="ts">
import type { ApiResponseFail } from '@/api/Base'
import type { UserFilters, UserResponse } from '@/api/User'

const { t } = useI18n()
const auth = useAuth()
const error = ref(null as ApiResponseFail | null)

const limit = 10

const users = ref([] as UserResponse[])
const filters = reactive({} as UserFilters)
const total = ref(0)
const pageAmount = computed(() => Math.ceil((total.value + 1) / limit))
const page = ref(1)
const offset = computed(() => (page.value - 1) * limit)

async function getUsers() {
  const response = await User.search(auth.config, filters, limit, offset.value)

  if (response.data !== null) {
    total.value = response.data.total
    users.value = response.data.results
  }
  else {
    error.value = response
  }
}

function updateFilter() {
  page.value = 1
  getUsers()
}

watch(offset, () => getUsers(), { immediate: true })
</script>

<template>
  <error-container v-if="error" :error="error" />
  <v-container v-else>
    <v-row>
      <v-col cols="12" md="11" lg="10" class="mx-auto">
        <v-card color="backgroundAlt">
          <v-card-title class="text-center lemon-milk">
            {{ t("handleUsers") }}
          </v-card-title>
          <v-card-text>
            <user-list-filter
              v-model:filters="filters"
              @update="updateFilter()"
            />
            <user-list
              :users="users"
              :show-add="users.length < limit"
              @update="getUsers()"
            />
            <v-row v-if="pageAmount > 1" cols="12">
              <v-pagination
                v-model="page"
                class="mx-auto pb-4"
                color="background text--primary"
                :length="pageAmount"
              />
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<i18n locale="en" lang="yaml">
getUsers: Get users
handleUsers: Handle users
</i18n>

<i18n locale="fr" lang="yaml">
getUsers: Chargement des utilisateurs
handleUsers: Gestion des utilisateurs
</i18n>

<route lang="yaml">
meta:
  needsAuth: true
</route>
