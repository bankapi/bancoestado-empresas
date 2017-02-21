module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // Crawler
    {
      name: 'CRAWLER',
      script: './lib/runCrawler.js',
      env: {
        DISPLAY: ':99'
      }
    },
    // runing Xvfb for headless use of nightmare (source https://github.com/segmentio/nightmare/issues/224#issuecomment-239335488)
    {
      name: 'Xvfb',
      interpreter: 'none',
      script: 'Xvfb',
      args: ':99'
    },
    // Server
    {
      name: 'SERVER',
      script: './lib/server/app.js'
    }
  ]
}
