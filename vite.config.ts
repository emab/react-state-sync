import { defineConfig } from "vitest/config";
import dts from 'vite-plugin-dts'

export default defineConfig({
    test: {
        environment: "happy-dom",
    },
    plugins: [dts()],
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'React State Sync',
            fileName: 'index',
        },
        rollupOptions: {
            external: ['react'],
            output: {
                globals: {
                    react: 'React',
                },
            },
        },
    },
})