/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/prod-api/': {
      // 要代理的地址
      target: 'http://106.119.167.29:90/prod-api',
      changeOrigin: true,
      pathRewrite: {
        '^/prod-api': '',
      },
    },
    '/api/ancient-system/': {
      // 要代理的地址
      target: 'http://192.168.0.14:9986/ancient_system_api',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },
    '/api/': {
      // 要代理的地址
      // target: 'https://devbj.jiatu.cloud:10443',
      target: 'http://101.42.6.90/api/stapi',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api': '',
      // },
    },

  },
  test: {
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
};
