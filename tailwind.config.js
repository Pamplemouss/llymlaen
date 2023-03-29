/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'neosans': ["ui-sans-serif", "'Neo Sans'"],
        'myriad': ["ui-sans-serif", "'Myriad Pro'"],
        'myriad-cond': ["ui-sans-serif", "'Myriad Pro Condensed'"],
      },
      textShadow: {
        sm: '1px 0px 1px var(--tw-shadow-color), -1px 0px 1px var(--tw-shadow-color), 0px 1px 1px var(--tw-shadow-color), 0px -1px 1px var(--tw-shadow-color)',
        DEFAULT: '1px 0px 2px var(--tw-shadow-color), -1px 0px 2px var(--tw-shadow-color), 0px 1px 2px var(--tw-shadow-color), 0px -1px 2px var(--tw-shadow-color)',
        lg: '1px 0px 4px var(--tw-shadow-color), -1px 0px 4px var(--tw-shadow-color), 0px 1px 4px var(--tw-shadow-color), 0px -1px 4px var(--tw-shadow-color)',
      },
      screens: {
        '4k': '2000px',
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
}
