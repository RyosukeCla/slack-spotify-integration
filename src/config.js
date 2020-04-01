const path = require('path')

module.exports = {
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackServer: {
      host: process.env.HOST || 'localhost',
      port: process.env.PORT || 8000
    },
    tokenPath: path.resolve(__dirname, '../token.json')
  },
  slack: {
    legacyToken: process.env.SLACK_LEGACY_TOKEN,
    playingStatus: {
      emoji: process.env.SLACK_PLAYING_STATUS_EMOJI || ':headphones:'
    }
  },
  pollingPeriod: 30 * 1000
}