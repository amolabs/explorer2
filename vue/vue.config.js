module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  "lintOnSave": false,
  devServer: {
    proxy: {
      '/api' : { // /api로 오는 모든 요청 Backend 서버로 패스
        target: 'http://localhost:3000',
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api' : ''  // /api/test2로 요청 시 -> http://localshot:3000/test2 로 변환
        // }
      }
    }
  }
}
