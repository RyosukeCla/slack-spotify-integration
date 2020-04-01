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
