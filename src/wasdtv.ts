import EventEmitter from 'events'
import { PassThrough } from 'stream'

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

  public sendMessage(stream_id: number, message: string, channel_id = 1, streamer_id = 1): void {
    return this._socket.sendMessage(stream_id, message, channel_id, streamer_id)
  }

  public sendSticker(stream_id: number, sticker_id: number, channel_id = 1, streamer_id = 1): void {
    return this._socket.sendSticker(stream_id, sticker_id, channel_id, streamer_id)
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
    return this._rest.getJWT()
  }

  public async getChannelInfo(channel_name: string): Promise<Wasd.ChannelInfo> {
    return this._rest.getChannelInfo(channel_name)
  }

  public async getStreamChatMessages(stream_id: number, limit = 500, offset = 0): Promise<Wasd.RestMessage<Wasd.Message>[]> {
    return this._rest.getStreamChatMessages<Wasd.Message>(stream_id, 'MESSAGE', limit, offset)
  }

  public async getStreamChatStickers(stream_id: number, limit = 500, offset = 0): Promise<Wasd.RestMessage<Wasd.StickerMessage>[]> {
    return this._rest.getStreamChatMessages<Wasd.StickerMessage>(stream_id, 'STICKER', limit, offset)
  }

  public async getStreamChatSubscribers(stream_id: number, limit = 500, offset = 0): Promise<Wasd.RestMessage<Wasd.SubscribeMessage>[]> {
    return this._rest.getStreamChatMessages<Wasd.SubscribeMessage>(stream_id, 'SUBSCRIBE', limit, offset)
  }

  public async getStreamChatHighlightedMessage(
    stream_id: number,
    limit = 500,
    offset = 0,
  ): Promise<Wasd.RestMessage<Wasd.HighlightedMessage>[]> {
    return this._rest.getStreamChatMessages<Wasd.HighlightedMessage>(stream_id, 'HIGHLIGHTED_MESSAGE', limit, offset)
  }

  public async addModerator(channel_id: number, user_id: number): Promise<boolean> {
    return this._rest.addModerator(channel_id, user_id)
  }

  public async deleteModerator(channel_id: number, user_id: number): Promise<boolean> {
    return this._rest.deleteModerator(channel_id, user_id)
  }

  public async listModerator(streamer_id: number): Promise<Wasd.Moderator[]> {
    return this._rest.listModerator(streamer_id)
  }

  public async banUser(channel_id: number, user_id: number, stream_id: number, keep_messages = true, duration = 10): Promise<boolean> {
    return this._rest.banUser(channel_id, user_id, stream_id, keep_messages, duration)
  }

  public async unbanUser(channel_id: number, user_id: number): Promise<boolean> {
    return this._rest.unbanUser(channel_id, user_id)
  }

  public async listBanned(streamer_id: number): Promise<Wasd.BannedUser[]> {
    return this._rest.listBanned(streamer_id)
  }

  public async getGifts(media_container_id: number): Promise<Wasd.Gift[]> {
    return this._rest.getGifts(media_container_id)
  }

  public async productsToSell(user_id: number): Promise<Wasd.Product[]> {
    return this._rest.productsToSell(user_id)
  }

  public async getWebCustomBlocks(channel_id: number): Promise<Wasd.WebCustomBlock[]> {
    return this._rest.getWebCustomBlocks(channel_id)
  }

  public async getPopularClips(): Promise<Wasd.Clip[]> {
    return this._rest.getPopularClips()
  }

  public async getClips(channel_id: number, limit = 20, offset = 0): Promise<Wasd.Clip[]> {
    return this._rest.getClips(channel_id, limit, offset)
  }

  public async getGames(limit = 20, offset = 0): Promise<Wasd.Game[]> {
    return this._rest.getGames(limit, offset)
  }

  public async getMediaContainers(
    media_container_status: Wasd.MediaStatus = 'RUNNING',
    media_container_type: Wasd.MediaContainerType = 'SINGLE',
    game_id?: number,
    limit = 20,
    offset = 0,
  ): Promise<Wasd.MediaContainerExtra[]> {
    return this._rest.getMediaContainers(media_container_status, media_container_type, game_id, limit, offset)
  }

  public async getChannelMediaContainers(
    media_container_status: Wasd.MediaStatus = 'RUNNING',
    media_container_type: Wasd.MediaContainerType = 'SINGLE',
    channel_id: number,
    limit = 20,
    offset = 0,
  ): Promise<Wasd.MediaContainerExtra[]> {
    return this._rest.getChannelMediaContainers(media_container_status, media_container_type, channel_id, limit, offset)
  }

  public async getChannelLinks(channel_id: number): Promise<Wasd.ChannelLink[]> {
    return this._rest.getChannelLinks(channel_id)
  }

  public async getProfile(): Promise<Wasd.User> {
    return this._rest.getProfile()
  }

  public async getNotifications(): Promise<Wasd.Notification[]> {
    return this._rest.getNotifications()
  }

  public async searchGames(search_phrase: string, limit = 20, offset = 0): Promise<Wasd.SearchResult<Wasd.Game>> {
    return this._rest.searchGames(search_phrase, limit, offset)
  }

  public async searchProfile(search_phrase: string, limit = 20, offset = 0): Promise<Wasd.SearchResult<Wasd.UserProfile>> {
    return this._rest.searchProfile(search_phrase, limit, offset)
  }

  public async searchChannel(search_phrase: string, limit = 20, offset = 0): Promise<Wasd.SearchResult<Wasd.Channel>> {
    return this._rest.searchChannel(search_phrase, limit, offset)
  }

  public async searchMediaContainer(
    media_container_name?: string,
    media_container_status?: Wasd.MediaStatus,
    limit = 20,
    offset = 0,
  ): Promise<Wasd.SearchResult<Wasd.MediaContainerExtra>> {
    return this._rest.searchMediaContainer(media_container_name, media_container_status, limit, offset)
  }

  public async getTags(type?: Wasd.TagType, limit = 30, offset = 0): Promise<Wasd.Tag[]> {
    return this._rest.getTags(type, limit, offset)
  }

  public async getStreamPushUrl(): Promise<Wasd.StreamPushUrl> {
    return this._rest.getStreamPushUrl()
  }

  public async getStreamClosedViewUrl(): Promise<Wasd.StreamClosedViewUrl> {
    return this._rest.getStreamClosedViewUrl()
  }

  public async getBroadcastLimits(): Promise<Wasd.BroadcastLimits> {
    return this._rest.getBroadcastLimits()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async setSetting(setting_key: Wasd.SettingKey, setting_value: any): Promise<Wasd.Setting[]> {
    return this._rest.setSetting(setting_key, setting_value)
  }

  public async getPosts(user_id: number, limit = 20, offset = 0): Promise<Wasd.Post[]> {
    return this._rest.getPosts(user_id, limit, offset)
  }

  public donwloadLiveMediaStream(user_id: number): PassThrough {
    return this._rest.downloadLiveMediaStream(user_id)
  }

  public downloadMediaByUrl(url: string): PassThrough {
    return this._rest.downloadMediaByUrl(url)
  }

  public downloadVod(media_container: Wasd.MediaContainer): PassThrough {
    return this._rest.downloadVod(media_container)
  }

  public async getMediaStreamMetadata(user_id: number): Promise<Wasd.MediaStreamMetadata> {
    return this._rest.getMediaStreamMetadata(user_id)
  }
}
