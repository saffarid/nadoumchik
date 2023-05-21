const os = require('os')
const p = require('path')

module.exports = {

    outputDir: p.resolve(__dirname, './../www'),

    pages: {
        index: {
            entry: './src/pages/nadoumchik/main.js',
            template: './public/index.html',
            filename: 'index.html',
            title: '#Надоумчик - для интеллектуалов',
            chunks: ['index', 'chunk-vendors', 'chunk-common', 'chunk-index-vendors', 'runtime~index'],
            meta: {
                'og:title': '#Надоумчик - для интеллектуалов',
                title: '#Надоумчик - для интеллектуалов',
                'og:description': 'Надоумчик - сайт для интеллектуалов. Головоломки, факты и интересные статьи только для тех, чей мозг любит развиваться.',
                description: 'Надоумчик - сайт для интеллектуалов. Головоломки, факты и интересные статьи только для тех, чей мозг любит развиваться.',
                'apple-touch-icon': '/icon/logo.svg',
                'yandex-verification': '58ebaf732d9a762d '
            }
        },
        cabinet: {
            entry: './src/pages/cabinet/main.js',
            template: './public/index.html',
            filename: 'cabinet.html',
            title: 'Кабинет',
            chunks: ['cabinet', 'chunk-vendors', 'chunk-common', 'chunk-cabinet-vendors', 'runtime~cabinet'],
            meta: {
                robots: 'noindex'
            }
        },
    },

    chainWebpack: config => {
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')

        const options = module.exports
        const pages = options.pages
        const pageKeys = Object.keys(pages)

        const IS_VENDOR = /[\\/]node_modules[\\/]/

        config.optimization
              .splitChunks({
                  cacheGroups: {
                      vendors: {
                          name: 'chunk-vendors',
                          priority: -10,
                          chunks: 'initial',
                          minChunks: 2,
                          test: IS_VENDOR,
                          enforce: true,
                      },
                      ...pageKeys.map(key => ({
                          name: `chunk-${key}-vendors`,
                          priority: -11,
                          chunks: chunk => chunk.name === key,
                          test: IS_VENDOR,
                          enforce: true,
                      })),
                      common: {
                          name: 'chunk-common',
                          priority: -20,
                          chunks: 'initial',
                          minChunks: 2,
                          reuseExistingChunk: true,
                          enforce: true,
                      },
                  },
              })
    },

    configureWebpack: {

        plugins: [ ],

        cache: {
            type: 'memory',
            cacheUnaffected: true,
        },

        optimization: {
            runtimeChunk: true,
            minimize: true,
            minimizer: [ ],
        },
    },

}

