var path = require('path')

module.exports = {
    port: '8000',
    hot: true,
    watch: [path.join(__dirname, 'src')],
    public: path.join(__dirname, 'dist'),
    ftl: {
        base: path.join(__dirname, 'dist/ftl')
    }
}