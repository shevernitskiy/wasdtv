<div align="center">

# WASD.tv API client

<img src="https://static.wasd.tv/assets/fe/images/logo/clear-logo-dark.svg" height="150">

</div>

<p align=center>
  <i>
 REST & Chat client for wasd.tv
  </i>
</p>

<div align="center">

[![downloads](https://img.shields.io/npm/dm/wasdtv)](https://www.npmjs.com/package/wasdtv)
[![size](https://img.shields.io/npm/v/wasdtv)](https://www.npmjs.com/package/wasdtv)

⚠️⚠️⚠️ This is raw alpha version. Totally untested, without proper error handling ⚠️⚠️⚠️

</div>

## Installation

```bash
npm i wasdtv
```

```bash
yarn add wasdtv
```

## Usage

### Obtaining token

To use REST api you should get token in [account setting area](https://wasd.tv/general-settings/API)

### REST requests

Http requests to api endpoints

```ts
import { WasdTv } from 'wasdtv'

const wasd = new WasdTv('YOUR_API_TOKEN')

const run = async () => {
  const channel_info = await wasd.getChannelInfo('emeraldgp')
  const chat_messages = await wasd.getStreamChatMessages(1016377, 501)
  const chat_stickers = await wasd.getStreamChatStickers(1015200)
  // ... other rest methods
}

run()
```

Available methods:

- getChannelInfo
- getStreamChatMessages
- getStreamChatStickers
- getStreamChatSubscribers
- getStreamChatHighlightedMessage
- addModerator
- deleteModerator
- listModerator
- banUser
- unbanUser
- listBanned
- getGifts
- productsToSell
- getWebCustomBlocks
- getPopularClips
- getClips
- getGames
- getMediaContainers
- getChannelLinks
- getProfile
- getNotifications
- searchGames
- searchProfile
- searchChannel
- searchMediaContainer
- getTags
- getStreamPushUrl
- getStreamClosedViewUrl
- getBroadcastLimits
- setSetting
- getPosts
- downloadLiveMediaStream
- downloadVod

### Chat

Interacting with chat pretty easy.

```ts
import { WasdTv } from 'wasdtv'

const wasd = new WasdTv('YOUR_API_TOKEN')

wasd.joinToChat(1016842, 68523)

wasd.on('joined', (ctx) => {
  wasd.sendMessage(1016842, 'hey!')
  wasd.sendSticker(1016842, 20)
})

wasd.on('message', (ctx) => {
  console.log('message', ctx)
})
```

Supported chat events:

- connect
- connect_error
- reconnect
- disconnect
- join
- joined
- system_message
- event
- giftsV1
- viewers
- message
- highlighted_message
- subscribe
- sticker
- user_ban
- messageDeleted
- paidMessage

These event are in web sources, but i never seen it (not typed):

- new_follower
- upgrade
- right_upgrade
- history
- history_events
- voting_start
- voting_started
- voting_make_choice
- voting_info
- voting_finished
- voting_choice_added
- notification
- settings_update
- messageDeleted

Methods to interact:

- joinToChat
- sendMessage
- sendSticker

### Downloading VODs

```ts
import { WasdTv } from 'wasdtv'
import fs from 'fs'

const wasd = new WasdTv('YOUR_API_TOKEN')

// Get array of STOPPED SIGNLE containers
const containers = await wasd.getChannelMediaContainers('STOPPED', 'SINGLE', 1372488)

// Download VOD from first container of the array
const media = wasd.downloadVod(container[0])
media.pipe(fs.createWriteStream('video.mp4'))

// Capture vod for 20s and close connection
setTimeout(() => {
  media.end()
}, 20 * 1000)
```

### Capturing Stream

Yes! You can capture stream (for example, into file)

```ts
import { WasdTv } from 'wasdtv'
import fs from 'fs'

const wasd = new WasdTv('YOUR_API_TOKEN')

// Get stream metadata
wasd.getMediaStreamMetadata(1328329).then((data) => {
  console.log(data)
})

const media = wasd.downloadLiveMediaStream(1328329)
media.pipe(fs.createWriteStream('video.mp4'))

// Capture 20s of stream and close connection
setTimeout(() => {
  media.end()
}, 20 * 1000)
```

## Warning

Due to the fact that Wasd has almost no adequate api documentation, typing was done by reversing responses. For this reason types can be incorrect and incomplete.

If you notice an error, please make a pull request or at least an issue.

## Contributing

Pull requests are welcome. Please use prettier format for your code.

## License

Distributed under the [MIT](https://choosealicense.com/licenses/mit/) License.
