import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    // match the app's vite css pipeline (vite.config.ts) so browser-mode
    // tests exercise the same class names production gets
    css: {
        modules: {
            localsConvention: 'camelCaseOnly',
        },
    },
    test: {
        projects: [
            // fast jsdom tests: component logic, data, contracts
            {
                extends: true,
                test: {
                    name: 'unit',
                    environment: 'jsdom',
                    globals: true,
                    setupFiles: './setupTests.ts',
                    include: ['src/**/*.test.{ts,tsx}'],
                    exclude: ['src/**/*.browser.test.{ts,tsx}'],
                    css: {
                        modules: {
                            // resolve css module classes to their plain names so
                            // tests can query them, e.g. querySelector('.tourPopup')
                            classNameStrategy: 'non-scoped',
                        },
                    },
                },
            },
            // real-Chromium tests: layout, CSS anchor positioning, viewport
            {
                extends: true,
                test: {
                    name: 'browser',
                    globals: true,
                    include: ['src/**/*.browser.test.{ts,tsx}'],
                    browser: {
                        enabled: true,
                        provider: playwright(),
                        headless: true,
                        instances: [{ browser: 'chromium' }],
                    },
                },
            },
        ],
    },
})
