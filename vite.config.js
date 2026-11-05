import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Percorsi relativi: il sito è pubblicato in /weather-app/ su GitHub Pages.
  base: './',
  plugins: [react()],
})
