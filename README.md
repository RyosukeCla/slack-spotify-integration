# slack-spotify-integration

## setup

1. register spotify developer
2. create spotify app
3. set callback url to http://localhost:8000
4. remember Client ID and Client Secret of spotify app
5. generate and remember slack legacy token (see https://api.slack.com/legacy/custom-integrations/legacy-tokens)

## start

```bash
$ npm i
$ SLACK_LEGACY_TOKEN=<...> \
  SPOTIFY_CLIENT_ID=<...> \
  SPOTIFY_CLIENT_SECRET=<...> \
  npm start
```

## environments

- SLACK_LEGACY_TOKEN: (required) slack legacy token
- SPOTIFY_CLIENT_ID: (required) spotify app client id
- SPOTIFY_CLIENT_SECRET: (required) spotify app client secret
- SLACK_PLAYING_STATUS_EMOJI: (optional, default `:headphones:`) status emoji when playing track
- HOST: (optional, default `localhost`) callback url host for spotify authentication
- PORT: (optional, default `8000`) callback url port for spotify authentication