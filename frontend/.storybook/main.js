const { mergeConfig } = require('vite')

module.exports = {
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
    ],
    framework: '@storybook/react',
    core: {
        builder: '@storybook/builder-vite',
        disableTelemetry: true,
    },
    features: {
        storyStoreV7: true,
    },
    async viteFinal(config) {
        return mergeConfig(config, {
            css: {
                modules: {
                    localsConvention: 'camelCaseOnly',
                },
            },
        })
    },
}
