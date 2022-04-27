const path = require('path')
module.exports = {

    outputDir: path.resolve(__dirname, './../../www/admin'),
    publicPath: '',

    css: {
        loaderOptions: {
            sass: {
                additionalData: '@import "@/assets/style/variable.scss";'
            }
        }
    },
}
