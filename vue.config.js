const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    host: '0.0.0.0',
    // 用 8080 而不是 80：80 端口在 Windows 上通常需要管理员权限
    port: 8080,
    open: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: `http://localhost:8088`,
        // 跨域设置
        changeOrigin: true,
        pathRewrite: {
          // 如果VUE_APP_BASE_API是 /dev-api   /dev-api/login  路径会被重写成 /login
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
  },
})
