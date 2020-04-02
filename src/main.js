const { setSlackProfileStatus } = require('./slack')
const { refreshToken, setupToken, getSpotifyCurrentTrack } = require('./spotify')
const config = require('./config')
const { pollingPeriod, slack: { playingStatus } } = config

function getMessage(track) {
  if (!track) {
    return ''
  }
  const { item: { artists, name } } = track
  const artist = artists.length > 0 ? artists[0] : { name: 'unknown' }
  return ` ${name} - ${artist.name}`
}

async function main() {
  console.log('[log] start slack spotify integration.')
  await setupToken()

  const updateProfile = async (preMessage, nextMessage) => {
    if (preMessage !== nextMessage) {
      if (nextMessage) {
        await setSlackProfileStatus({
          emoji: playingStatus.emoji,
          message: nextMessage
        })
      } else {
        // clear profile
        await setSlackProfileStatus({
          emoji: '',
          message: ''
        })
      }
    }
  }
  
  let preMessage = ''
  const loop = async () => {
    const currentTrack = await getSpotifyCurrentTrack()
    const message = getMessage(currentTrack)
    await updateProfile(preMessage, message)
    preMessage = message
  }

  await loop()
  setInterval(() => {
    loop().catch(e => console.error(e))
  }, pollingPeriod)
}

main()
