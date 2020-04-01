const { writeFileSync, readFileSync, statSync } = require('fs');
const fetch = require('node-fetch');
const http = require('http');
const { execSync } = require('child_process');
const url = require('url');
const config = require('./config');

const { spotify: { clientId, clientSecret, callbackServer, tokenPath } } = config;
const authorizeBaseUrl = 'https://accounts.spotify.com/authorize'
const redirect_uri = `http://${callbackServer.host}:${callbackServer.port}`
const scope = 'user-read-currently-playing'
const authorizeUrl = `${authorizeBaseUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${scope}&response_type=code`
const authorizationHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`

function getAuthorizationCode() {
  return new Promise(async (resolve, reject) => {
    const server = http.createServer((req, res) => {
      const { query } = url.parse(req.url, true)
      if (!query.code) {
        res.writeHead(200)
        res.end()
        reject()
      }
      
      res.writeHead(200)
      res.write('<script>window.close()</script>');
      res.end();

      server.close();
      resolve(query.code);
    })
    await new Promise((resolve) => {
      server.listen(callbackServer.port, () => {
        resolve()
      })
    })
    execSync(`open '${authorizeUrl}'`)
  })
}

async function getTokens(authCode) {
  const server = http.createServer((req, res) => {
    res.writeHead(200)
    res.end()
  })
  await new Promise((resolve) => {
    server.listen(callbackServer.port, () => {
      resolve()
    })
  })
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: 'POST',
    body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${redirect_uri}`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      'Authorization': authorizationHeader,
    }
  })

  server.close()
  return await res.json()
}

async function getNewAccessTokens(refreshToken) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: 'POST',
    body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      'Authorization': authorizationHeader,
    }
  })

  return await res.json()
}

exports.refreshToken = function() {
  const tokenJson = JSON.parse(readFileSync(tokenPath).toString())
  const { refresh_token, expires_in } = tokenJson

  setInterval(async () => {
    const newToken = await getNewAccessTokens(refresh_token)
    writeFileSync(tokenPath, JSON.stringify({
      ...tokenJson,
      access_token: newToken.access_token
    }))
    console.log(`[log] refreshed access token.`)
  }, (expires_in - 600) * 1000)
}

exports.setupToken = async function() {
  try {
    const tokenJson = JSON.parse(readFileSync(tokenPath).toString())
    console.log(`[log] already have access token. and refresh access token.`)
    const { refresh_token } = tokenJson
    const newToken = await getNewAccessTokens(refresh_token)
    writeFileSync(tokenPath, JSON.stringify({
      ...tokenJson,
      access_token: newToken.access_token
    }))
    console.log(`[log] refreshed access token.`)
  } catch(e) {
    console.log(`[log] have not access token. and get access token.`)
    const authCode = await getAuthorizationCode()
    const { access_token, refresh_token, expires_in } = await getTokens(authCode)
    writeFileSync(tokenPath, JSON.stringify({
      access_token,
      refresh_token,
      expires_in
    }))
    console.log(`[get] got access token`)
  }
}

exports.getSpotifyCurrentTrack = async function() {
  const tokenJson = JSON.parse(readFileSync(tokenPath).toString())
  const { access_token } = tokenJson

  const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  })

  if (res.status !== 200) {
    return false
  }

  return await res.json()
}