import EventEmitter from 'events'

import RestClient from './clients/rest'
import SocketClient from './clients/socketio'
import { Wasd } from './types/api'

export class WasdTv extends EventEmitter {
  private _rest!: RestClient
  private _socket!: SocketClient
  private _jwt!: Wasd.JWT
  private _subs: (keyof Wasd.EventMap)[] = []
  private _originalOn = EventEmitter.prototype.on
  private _originalOff = EventEmitter.prototype.off

  constructor(private token: string) {
    super()
    this.init()
  }

  private init(): void {
    this._rest = new RestClient(this.token)
  }

  public async joinToChat(stream_id: number, channel_id: number): Promise<void> {
    await this.connectGuard()
    this._socket.join(stream_id, channel_id)

    this._subs.forEach((event) => {
      this._socket.on(event, (ctx) => {
        this.emit(event, ctx)
      })
    })
  }

  public async leaveChat(stream_id: number): Promise<void> {
    await this.connectGuard()
    this._socket.leave(stream_id)
  }

  private async connectGuard(): Promise<void> {
    if (this._socket === undefined) {
      this._jwt = await this._rest.getJWT()
      this._socket = new SocketClient(this._jwt)
    }
  }

  public on<T extends Wasd.EventMap, V extends keyof Wasd.EventMap>(event: V, listener: (ctx: Pick<T, V>[V]) => void): this {
    this._subs.push(event)

    return this._originalOn(event, listener) as this
  }

  public off<T extends Wasd.EventMap, V extends keyof Wasd.EventMap>(event: V, listener: (ctx: Pick<T, V>[V]) => void): this {
    this._subs = this._subs.filter((e) => e !== event)

    return this._originalOff(event, listener) as this
  }

  public async getJWT(): Promise<Wasd.JWT> {
    return await this._rest.getJWT()
  }

  public async getChannelInfo(streamer_alias: string): Promise<Wasd.ChannelInfo> {
    return await this._rest.getChannelInfo(streamer_alias)
  }

  public async getStreamChatMessages(stream_id: number, limit = 500, offset = 0): Promise<Wasd.RestMessage<Wasd.Message>[]> {
    return await this._rest.getStreamChatMessages<Wasd.Message>(stream_id, 'MESSAGE', limit, offset)
  }

  public async getStreamChatStickers(stream_id: number, limit = 500, offset = 0): Promise<Wasd.RestMessage<Wasd.StickerMessage>[]> {
    return await this._rest.getStreamChatMessages<Wasd.StickerMessage>(stream_id, 'STICKER', limit, offset)
  }

  public async getStreamChatSubscribers(stream_id: number, limit = 500, offset = 0): Promise<Wasd.RestMessage<Wasd.SubscribeMessage>[]> {
    return await this._rest.getStreamChatMessages<Wasd.SubscribeMessage>(stream_id, 'SUBSCRIBE', limit, offset)
  }

  public async getStreamChatHighlightedMessage(
    stream_id: number,
    limit = 500,
    offset = 0,
  ): Promise<Wasd.RestMessage<Wasd.HighlightedMessage>[]> {
    return await this._rest.getStreamChatMessages<Wasd.HighlightedMessage>(stream_id, 'HIGHLIGHTED_MESSAGE', limit, offset)
  }

  public async addModerator(channel_id: number, user_id: number): Promise<boolean> {
    return await this._rest.addModerator(channel_id, user_id)
  }

  public async deleteModerator(channel_id: number, user_id: number): Promise<boolean> {
    return await this._rest.deleteModerator(channel_id, user_id)
  }

  public async listModerator(streamer_id: number): Promise<Wasd.Moderator[]> {
    return await this._rest.listModerator(streamer_id)
  }

  public async banUser(channel_id: number, user_id: number, stream_id: number, keep_messages = true, duration = 10): Promise<boolean> {
    return await this._rest.banUser(channel_id, user_id, stream_id, keep_messages, duration)
  }

  public async unbanUser(channel_id: number, user_id: number): Promise<boolean> {
    return await this._rest.unbanUser(channel_id, user_id)
  }

  public async listBanned(streamer_id: number): Promise<Wasd.BannedUser[]> {
    return await this._rest.listBanned(streamer_id)
  }

  public async getGifts(media_container_id: number): Promise<Wasd.Gift[]> {
    return await this._rest.getGifts(media_container_id)
  }

  public async productsToSell(user_id: number): Promise<Wasd.Product[]> {
    return await this._rest.productsToSell(user_id)
  }

  public async getWebCustomBlocks(channel_id: number): Promise<Wasd.WebCustomBlock[]> {
    return await this._rest.getWebCustomBlocks(channel_id)
  }

  public async getPopularClips(): Promise<Wasd.Clip[]> {
    return await this._rest.getPopularClips()
  }

  public async getGames(limit = 20, offset = 0): Promise<Wasd.Game[]> {
    return await this._rest.getGames(limit, offset)
  }
}

// const wasd = new WasdTv('KNXMlTXWSqAyE75gtLBMcrcwYpehaTHSLlewreKppT0.yvRUa1mBSbL9oxj1jkohRE54ES-vKZQesjwqny9UJ2M')

// wasd.getChannelInfo('emeraldgp').then((data) => {
//   console.log(data.media_container?.media_container_streams)
//   console.log(data)
// })

// wasd.getStreamChatMessages(1016377, 501).then((data) => {
//   console.log(data)
// })

// wasd.getStreamChatStickers(1015200).then((data) => {
//   console.log(data[0].info.sticker)
// })

// wasd.getStreamChatHighlightedMessage(1015200).then((data) => {
//   console.log(data)
// })

// wasd.getStreamChatSubscribers(1015478).then((data) => {
//   console.log(data)
// })

// setTimeout(() => {
//   wasd.joinToChat(1015478, 1276249)
//   console.log('hey')
// }, 1000)

// wasd.joinToChat(1016842, 68523)
// console.log('hey')

// wasd.on('event', (ctx) => {
//   console.log('event', ctx)
// })

// wasd.on('subscribe', (ctx) => {
//   console.log('subscribe', ctx)
// })

// wasd.on('connect', (ctx) => {
//   console.log('connect', ctx)
// })

// wasd.on('viewers', (ctx) => {
//   console.log('viewers', ctx)
// })

// wasd.on('system_message', (ctx) => {
//   console.log('system_message', ctx)
// })

// wasd.on('giftsV1', (ctx) => {
//   console.log('giftsV1', ctx)
// })

// wasd.on('message', (ctx) => {
//   console.log('message', ctx)
// })
