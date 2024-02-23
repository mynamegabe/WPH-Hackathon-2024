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
          bgPrimary: '#f4f3ee',
          bgSecondary: '#edede9',
          textPrimary: '#463f3a',
          textSecondary: '#403d39',
          primary: '#a3c4f3',
          red: '#e63946',
        }
      },
      dark :{
        colors: {
          bgPrimary: '#252422',
          bgSecondary: '#403d39',
          textPrimary: '#f4f3ee',
          textSecondary: '#f5ebe0',
          primary: '#00b4d8',
          red: '#ef233c',
        }
      }
    }
  })],
}
