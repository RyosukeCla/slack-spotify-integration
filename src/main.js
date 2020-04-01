const { setSlackProfileStatus } = require('./slack')
const { refreshToken, setupToken, getSpotifyCurrentTrack } = require('./spotify')
const config = require('./config')
const { pollingPeriod } = config

function getMessage(track) {
  if (!track) {
    return ''
  }
  const { item: { artists, name } } = track
  const artist = artists.length > 0 ? artists[0] : { name: 'unknown' }
  return `${name} - ${artist.name}`
}

async function main() {
  console.log('[log] start slack spotify integration.')
  await setupToken()
  refreshToken()

  const setPlayingProfile = async (message) => {
    await setSlackProfileStatus({
      emoji: ':spotify:',
      message
    })
  }

  const clearProfile = async () => {
    await setSlackProfileStatus({
      emoji: '',
      message: ''
    })
  }

  const updateProfile = async (preMessage, nextMessage) => {
    if (preMessage !== nextMessage) {
      if (nextMessage) {
        await setPlayingProfile(nextMessage)
      } else {
        await clearProfile()
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
