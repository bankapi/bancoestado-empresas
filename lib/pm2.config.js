module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: 'CRAWLER',
      script: './lib/runCrawler.js',
      args: ''
    },

    // Second application
    {
      name: 'SERVER',
      script: './lib/server/app.js'
    }
  ]
}
