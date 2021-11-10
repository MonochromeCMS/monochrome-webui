import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';

import i18n from '../i18n';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
  },
  lang: {
    t: (key, ...params) => i18n.tc(key, 0, params),
  },
  theme: {
    themes: {
      dark: {
        accent: colors.purple.accent4,
        background: colors.shades.black,
        backgroundAlt: colors.grey.darken4,
        primary: colors.shades.white,
        secondary: colors.grey.lighten3,
      },
      light: {
        accent: colors.purple.accent1,
        background: colors.grey.lighten3,
        backgroundAlt: colors.shades.white,
        primary: colors.shades.black,
        secondary: colors.grey.darken3,
      },
    },
  },
});
