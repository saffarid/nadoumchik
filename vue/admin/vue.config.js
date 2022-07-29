const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const webpack = require('webpack')
const os = require('os')
const path = require('path')

const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });


module.exports = {

    outputDir: path.resolve(__dirname, './../../www'),
    // publicPath: '',

    pages: {
        index: {
            entry: 'src/index/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'Index',
        },
        admin: {
            entry: 'src/admin/main.js',
            template: 'public/index.html',
            filename: 'admin.html',
            title: 'Admin',
        },
    },

    css: {
        loaderOptions: {
            sass: {
                additionalData: '@import "@/assets/style/variable.scss";'
            }
        }
    },

    configureWebpack: {

        plugins: [
            new webpack.HashedModuleIdsPlugin(), // в результате хэши не будут неожиданно меняться
            // new SpeedMeasurePlugin(),
            new HappyPack({
                id: 'vue',
                loaders: [
                    'sass-loader',
                    'vue-loader',
                    "css-loader"
                ],
                threadPool: happyThreadPool,
                cache: true,
                verbose: true
            })
        ],
        cache: {
            type: 'memory',
            // memoryCacheUnaffected: true,
            cacheUnaffected: true,
            // idleTimeout: 60000,
            // idleTimeoutAfterLargeChanges: 1000,
            // idleTimeoutForInitialStore: 0,
        },
        // module:{
        //    rules: [{
        //       test: /\.vue$/,
        //       use: [
        //          'cache-loader',
        //          'vue-loader'
        //       ]
        //    }],
        // },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                minSize: 20000,
                maxSize: 100000,
                maxAsyncRequests: 2,
                maxInitialRequests: 2,
                cacheGroups: {
                    vendor: {
                        chunks: 'all',
                        test: /[\\/]node_modules[\\/]/,
                        reuseExistingChunk: true,
                        enforce: true,
                        name(module) {
                            // получает имя, то есть node_modules/packageName/not/this/part.js
                            // или node_modules/packageName
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]

                            // имена npm-пакетов можно, не опасаясь проблем, использовать
                            // в URL, но некоторые серверы не любят символы наподобие @
                            return `npm.${packageName.replace('@', '')}`
                        },
                    },
                },
            },
        },
        //plugins: [ new BundleAnalyzerPlugin() ],
        /*resolve: {
          alias: {
            dgram: "dgram-browserify"
          }
        },*/
    },
}
