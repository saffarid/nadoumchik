const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const os = require('os')
const p = require('path')

const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});


module.exports = {

    outputDir: p.resolve(__dirname, './../../www'),
    // publicPath: '\./',

    pages: {
        index: {
            entry: './src/nadoumchik/main.js',
            template: './public/index.html',
            filename: 'index.html',
            title: '#Надоумчик',
            chunks: ['index', 'chunk-vendors', 'chunk-common', 'chunk-index-vendors'],
            meta: {
                title: '#Надоумчик',
                description: 'Надоумчик - сайт для интеллектуалов. Головоломки, факты и интересные статьи только для тех, чей мозг любит развиваться.'
            },
        },
        cabinet: {
            entry: './src/cabinet/main.js',
            template: './public/index.html',
            filename: 'cabinet.html',
            title: 'Кабинет',
            chunks: ['cabinet', 'chunk-vendors', 'chunk-common', 'chunk-cabinet-vendors'],
        },
    },

    css: {
        loaderOptions: {
            sass: {
                // additionalData: '@import "@/assets/style/variable.scss";'
            }
        }
    },


    chainWebpack: config => {
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')

        const options = module.exports
        const pages = options.pages
        const pageKeys = Object.keys(pages)

        // Long-term caching

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

        plugins: [
            // new BundleAnalyzerPlugin(),
            new webpack.HashedModuleIdsPlugin(), // в результате хэши не будут неожиданно
            new SpeedMeasurePlugin(),
            new HappyPack({
                id: 'vue',
                loaders: ['sass-loader', 'vue-loader', "css-loader"],
                threadPool: happyThreadPool,
                cache: true,
                verbose: true
            })
        ],

        cache: {
            type: 'memory',
            cacheUnaffected: true,
        },
    },

}

