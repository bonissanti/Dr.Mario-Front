import { defineConfig } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    test: {
        include: ['src/tests/**/*.test.ts'],
        globals: true,
    }
})