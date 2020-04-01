const path = require('path')

module.exports = {
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackServer: {
      host: 'localhost',
      port: 8000
    },
    tokenPath: path.resolve(__dirname, '../token.json')
  },
  slack: {
    legacyToken: process.env.SLACK_LEGACY_TOKEN,
  },
  pollingPeriod: 30 * 1000
}