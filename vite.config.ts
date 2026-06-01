import { defineConfig } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    build: {
        sourcemap: true
    },
    oxc: {
        sourcemap: true
    },
    test: {
        environment: 'jsdom',
        include: ['src/tests/**/*.test.ts'],
        globals: true,
    }
})