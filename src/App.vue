<script setup lang="ts">
type NeedsAuth = boolean | undefined

const auth = useAuth()
const router = useRouter()
const route = useRoute()
const needsAuth = computed(() => route.meta.needsAuth as NeedsAuth)
const settings = useSettings()

watchEffect(() => {
  switch (true) {
    case needsAuth.value && !auth.isConnected:
    case needsAuth.value === false && auth.isConnected:
      router.replace('/')
  }
})

onMounted(() => {
  if (auth.isConnected)
    auth.getUserData()

  settings.get()
})
</script>

<template>
  <v-app>
    <nav-bar />
    <v-main class="background">
      <router-view v-slot="{ Component }">
          <keep-alive>
              <component :is="Component" />
          </keep-alive>
      </router-view>

    </v-main>
    <notifications />
    <theme-toggle />
    <ReloadPrompt />
  </v-app>
</template>
