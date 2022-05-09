const path = require('path')
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
}
