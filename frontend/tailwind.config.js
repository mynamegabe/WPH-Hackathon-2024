import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui({
    themes :{
      light: {
        colors: {
          bgPrimary: '#FEFEFC',
          bgSecondary: '#FDFCF8',
          textPrimary: '#0D0C04',
          textSecondary: '#0D0C04',
          primary: '#a3c4f3',
          red: '#e63946',
        }
      },
      dark :{
        colors: {
          bgPrimary: '#0D0C04',
          bgSecondary: '#191919',
          textPrimary: '#FEFEFC',
          textSecondary: '#FDFCF8',
          primary: '#446EE2',
          red: '#ef233c',
        }
      }
    }
  })],
}
