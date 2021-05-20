import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'
import plugin from 'windicss/plugin'

export default defineConfig({
  darkMode: 'class',

  extract: {
    include: ['components/**/*.vue', 'layouts/**/*.vue', 'pages/**/*.vue'],
    exclude: ['node_modules/**/*', '.git/**/*'],
  },

  theme: {
    fontFamily: {
      sans: ['Inter'],
      mono: ['Source Code Pro'],
    },

    extend: {
      colors: {
        gray: colors.trueGray,
      },
    },
  },

  plugins: [
    require('windicss/plugin/line-clamp'),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.input-shadow': {
          'box-shadow': '0 2px 6px rgb(0 0 0 / 5%)',
        },
      })
    }),
  ],
})
