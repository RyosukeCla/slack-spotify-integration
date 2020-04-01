const fetch = require('node-fetch');
const config = require('./config');
const { slack: { legacyToken } } = config;

exports.setSlackProfileStatus = async function({ emoji, message }) {
  const res = await fetch('https://slack.com/api/users.profile.set', {
    method: 'POST',
    body: JSON.stringify({
      profile: {
        status_text: message,
        status_emoji: emoji,
      },
    }),
    headers: {
      'Content-type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${legacyToken}`,
    }
  })

  if (res.status !== 200) {
    console.log('[log] coudnt set slack profile status')
    return
  }
  const json = await res.json()
  if (!json.ok) {
    console.log('[log] coudnt set slack profile status', json)
  }

  console.log(`[log] set profile: ${JSON.stringify({ emoji, message })}`)
}
