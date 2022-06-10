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

To use REST api you should make token in [account setting area](https://wasd.tv/general-settings/API)

### REST requests

Http requests to api endpoints

```ts
import { WasdTv } from 'gismeteo'

const wasd = new WasdTv('YOUR_API_TOKEN')

const run = async () => {
  const channel_info = await wasd.getChannelInfo('emeraldgp')
  const chat_messages = await wasd.getStreamChatMessages(1016377, 501)
  const chat_stickers = await wasd.getStreamChatStickers(1015200)
  // ... other rest methods
}

run()
```

### Chat

Connecting to chat socket.io server

```ts
import { WasdTv } from 'gismeteo'

const wasd = new WasdTv('YOUR_API_TOKEN')

wasd.joinToChat(1016842, 68523)

wasd.on('event', (ctx) => {
  console.log('event', ctx)
})

wasd.on('subscribe', (ctx) => {
  console.log('subscribe', ctx)
})

wasd.on('connect', () => {
  console.log('connect')
})

wasd.on('viewers', (ctx) => {
  console.log('viewers', ctx)
})

wasd.on('system_message', (ctx) => {
  console.log('system_message', ctx)
})

wasd.on('giftsV1', (ctx) => {
  console.log('giftsV1', ctx)
})

wasd.on('message', (ctx) => {
  console.log('message', ctx)
})
```

## Warning

Due to the fact that Wasd has almost no adequate api documentation, typing was done by reversing responses. For this reason types can be incorrect and incomplete.

If you notice an error, please make a pull request or at least leave the issue.

## Contributing

Pull requests are welcome. Please use prettier format for your code.

## License

Distributed under the [MIT](https://choosealicense.com/licenses/mit/) License.
