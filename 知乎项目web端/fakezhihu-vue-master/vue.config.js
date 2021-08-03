module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://116.62.222.212',
        changeOrigin: true,
        // autoRewrite: true,
        cookieDomainRewrite: true,
        // pathRewrite: { // 路径重写，
        //   '^/api': '' // 替换target中的请求地址，也就是说以后你在请求http://api.douban.com/v2/XXXXX这个地址的时候直接写成/api即可。
        // }
      },
    },
  },
};