module.exports = {
  lintOnSave: false,
  pwa: {
    name: 'NCR CEPAT',
    themeColor: '#ffffff',
    manifestOptions: {
      background_color: '#ffffff'
    },
    iconPaths: {
      msTileImage: 'img/icons/mstile-150x150.png'
    },
    workboxOptions: {
      navigateFallback: 'index.html',
      skipWaiting: true,
      exclude: [
        /\.htaccess$/
      ]
    }
  },
  chainWebpack: config => {
    config.module
      .rule('pdf')
      .test(/\.(pdf)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
  }
}
