<script setup lang="ts">
const { t } = useI18n()
const auth = useAuth()

interface Item {
  text: string
  to?: string
  href?: string
  target?: string
}

const items = computed(() => {
  const result: Item[] = []
  if (Manga.canCreate(auth.role)) {
    result.push({
      text: 'createManga',
      to: '/manga/new',
    })
  }

  result.push(
    User.canEdit(auth.role)
      ? {
          text: 'handleUsers',
          to: '/users',
        }
      : {
          text: 'myUser',
          to: '/users/me',
        },
  )

  if (Settings.canEdit(auth.role)) {
    result.push({
      text: 'customizeWebsite',
      to: '/settings',
    })
  }

  result.push(
    {
      text: 'logout',
      to: '/logout',
    },
    {
      href: `${Base.basePath}/docs`,
      target: '_blank',
      text: 'apiDocs',
    },
  )

  return result
})
</script>

<template>
  <v-list>
    <v-list-subheader class="text-uppercase welcome-back">
      {{ t("welcomeBack", { username: auth.username }) }}
    </v-list-subheader>
    <v-list-item
      v-for="item in items"
      :key="item.text"
      :to="item.to"
      :href="item.href"
      :target="item.target"
      :title="t(item.text)"
    >
      <v-tooltip activator="parent" bottom open-delay="600">
        {{ t(item.text) }}
      </v-tooltip>
    </v-list-item>
  </v-list>
</template>

<style>
  .welcome-back .v-list-subheader__text {
    white-space: break-spaces;
  }
</style>

<i18n locale="en" lang="yaml">
welcomeBack: 'Welcome back, {username}'
createManga: Create manga
handleUsers: Handle users
myUser: My user
customizeWebsite: Customize website
logout: Logout
apiDocs: API Documentation
</i18n>

<i18n locale="fr" lang="yaml">
welcomeBack: 'Bienvenue, {username}'
createManga: Ajouter un manga
handleUsers: Gérer les utilisateurs
myUser: Mon utilisateur
customizeWebsite: Personnaliser le site
logout: Se déconnecter
apiDocs: Documentation API
</i18n>
