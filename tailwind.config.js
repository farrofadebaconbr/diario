// File: tailwind.config.js (COM A LINHA ADICIONADA)
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './src/routes/+layout.svelte' // <-- ADICIONE ESTA LINHA ESPECÍFICA
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('daisyui')
  ],
  daisyui: {
    themes: [
      "light",
      "dark",
      "corporate",
      "dracula",
      "forest",
      "lofi",
    ],
  },
};