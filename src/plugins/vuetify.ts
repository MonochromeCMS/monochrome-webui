// Styles
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import type { ThemeDefinition } from 'vuetify'
// import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#EEEEEE',
    backgroundAlt: '#FFFFFF',
    primary: '#000000',
    secondary: '#616161',
  },
}
const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#000000',
    backgroundAlt: '#212121',
    primary: '#FFFFFF',
    secondary: '#9E9E9E',
  },
}

export default createVuetify({
  // locale: createVueI18nAdapter(),
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
})
