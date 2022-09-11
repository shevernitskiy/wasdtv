import axios, { AxiosInstance, AxiosError } from 'axios'
import m3u8stream from 'm3u8stream'
import { PassThrough } from 'stream'

import { HttpError, ApiError } from '../core/error'
import { Wasd } from '../types/api'

export default class RestClient {
  private _axios: AxiosInstance

  constructor(private token: string) {
    this._axios = axios.create({
      baseURL: 'https://wasd.tv/api/',
      headers: {
        Authorization: `Token ${this.token}`,
      },
    })
  }

  public async getJWT(): Promise<Wasd.JWT> {
    return this._axios
      .post('auth/chat-token')
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getChannelInfo(channel_name: string): Promise<Wasd.ChannelInfo> {
    return this._axios
      .get('v2/broadcasts/public', {
        params: {
          channel_name: channel_name,
        },
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getStreamChatMessages<T extends Wasd.InfoType>(
    stream_id: number,
    message_type: Wasd.MessageType,
    limit = 500,
    offset = 0,
  ): Promise<Wasd.RestMessage<T>[]> {
    return this._axios
      .get(`chat/streams/${stream_id}/messages`, {
        params: {
          type: message_type.toLocaleUpperCase(),
          limit: limit,
          offset: offset,
        },
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async setChatSettings(stream_id: number, chat_role_limit: Wasd.ChatPermission, chat_delay: Wasd.ChatDelay): Promise<boolean> {
    return this._axios
      .post(`chat/streams/${stream_id}/settings`, {
        chatRoleLimitMode: chat_role_limit,
        chatDelayLimitMode: chat_delay,
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async addModerator(channel_id: number, user_id: number): Promise<boolean> {
    return this._axios
      .put(`channels/${channel_id}/moderators`, { user_id: user_id })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async deleteModerator(channel_id: number, user_id: number): Promise<boolean> {
    return this._axios
      .delete(`api/channels/${channel_id}/moderators/${user_id}`)
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async listModerator(streamer_id: number): Promise<Wasd.Moderator[]> {
    return this._axios
      .get(`chat/streamers/${streamer_id}/moderators`)
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async banUser(channel_id: number, user_id: number, stream_id: number, keep_messages = true, duration = 10): Promise<boolean> {
    return this._axios
      .put(`api/channels/${channel_id}/banned-users`, {
        user_id: user_id,
        stream_id: stream_id,
        keep_messages: keep_messages,
        duration: duration,
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async unbanUser(channel_id: number, user_id: number): Promise<boolean> {
    return this._axios
      .delete(`api/channels/${channel_id}/users/${user_id}`)
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async listBanned(streamer_id: number): Promise<Wasd.BannedUser[]> {
    return this._axios
      .get(`chat/streamers/${streamer_id}/ban`)
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getGifts(media_container_id: number): Promise<Wasd.Gift[]> {
    return this._axios
      .get('v2/gifts', {
        params: {
          media_container_id: media_container_id,
        },
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async productsToSell(user_id: number): Promise<Wasd.Product[]> {
    return this._axios
      .get('v2/shop/products-to-sell', {
        params: {
          user_id: user_id,
        },
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getWebCustomBlocks(channel_id: number): Promise<Wasd.WebCustomBlock[]> {
    return this._axios
      .get(`v2/channels/${channel_id}/custom_blocks`)
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getStickerPack(streamer_id: number, limit = 100, offset = 0): Promise<Wasd.StickerPack[]> {
    return this._axios
      .get(`api/chat/streamers/${streamer_id}/stickerpack`, {
        params: {
          limit: limit,
          offset: offset,
        },
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getPopularClips(): Promise<Wasd.Clip[]> {
    return this._axios
      .get(`v2/main/clips/popular`)
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getClips(channel_id: number, limit: number, offset: number): Promise<Wasd.Clip[]> {
    return this._axios
      .get('v2/clips', {
        params: {
          clip_channel_id: channel_id,
          limit: limit,
          offset: offset,
        },
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getGames(limit = 20, offset = 0): Promise<Wasd.Game[]> {
    return this._axios
      .get('games', {
        params: {
          limit: limit,
          offset: offset,
        },
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getMediaContainers(
    media_container_status?: Wasd.MediaStatus,
    media_container_type?: Wasd.MediaContainerType,
    game_id?: number,
    limit = 20,
    offset = 0,
  ): Promise<Wasd.MediaContainerExtra[]> {
    return this._axios
      .get(`v2/media-containers`, {
        params: {
          media_container_status: media_container_status,
          media_container_type: media_container_type,
          game_id: game_id,
          limit: limit,
          offset: offset,
        },
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getChannelMediaContainers(
    media_container_status?: Wasd.MediaStatus,
    media_container_type?: Wasd.MediaContainerType,
    channel_id?: number,
    limit = 20,
    offset = 0,
  ): Promise<Wasd.MediaContainerExtra[]> {
    return this._axios
      .get(`v2/media-containers/plain`, {
        params: {
          media_container_status: media_container_status,
          media_container_type: media_container_type,
          channel_id: channel_id,
          limit: limit,
          offset: offset,
        },
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getProfile(): Promise<Wasd.User> {
    return this._axios
      .get('v2/profiles/current')
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getNotifications(): Promise<Wasd.Notification[]> {
    return this._axios
      .get('v2/notifications/bell')
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getChannelLinks(channel_id: number): Promise<Wasd.ChannelLink[]> {
    return this._axios
      .get(`channels/${channel_id}/links`)
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async searchGames(search_phrase: string, limit: number, offset: number): Promise<Wasd.SearchResult<Wasd.Game>> {
    return this._axios
      .get('search/games', {
        params: {
          search_phrase: search_phrase,
          limit: limit,
          offset: offset,
        },
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async searchProfile(search_phrase: string, limit: number, offset: number): Promise<Wasd.SearchResult<Wasd.UserProfile>> {
    return this._axios
      .get('search/profiles', {
        params: {
          search_phrase: search_phrase,
          limit: limit,
          offset: offset,
        },
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async searchChannel(search_phrase: string, limit: number, offset: number): Promise<Wasd.SearchResult<Wasd.Channel>> {
    return this._axios
      .get('search/channels', {
        params: {
          search_phrase: search_phrase,
          limit: limit,
          offset: offset,
        },
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async searchMediaContainer(
    media_container_name?: string,
    media_container_status?: Wasd.MediaStatus,
    limit = 20,
    offset = 0,
  ): Promise<Wasd.SearchResult<Wasd.MediaContainerExtra>> {
    return this._axios
      .get('v2/search/media-containers', {
        params: {
          media_container_name: media_container_name,
          media_container_status: media_container_status,
          limit: limit,
          offset: offset,
        },
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getTags(type?: Wasd.TagType, limit = 30, offset = 0): Promise<Wasd.Tag[]> {
    return this._axios
      .get('v2/tags', {
        params: {
          type: type,
          limit: limit,
          offset: offset,
        },
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getStreamPushUrl(): Promise<Wasd.StreamPushUrl> {
    return this._axios
      .get('auth/users/current/stream-push-url')
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getStreamClosedViewUrl(): Promise<Wasd.StreamClosedViewUrl> {
    return this._axios
      .get('v2/profiles/current/broadcasts/closed-view-url')
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getBroadcastLimits(): Promise<Wasd.BroadcastLimits> {
    return this._axios
      .get('v2/broadcast-limits')
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  // TODO: investigate possible search_value types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async setSetting(setting_key: Wasd.SettingKey, setting_value: any): Promise<Wasd.Setting[]> {
    return this._axios
      .patch('profiles/current/settings', {
        new_settings: [
          {
            setting_key: setting_key,
            setting_value: setting_value,
          },
        ],
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getPosts(user_id: number, limit: number, offset: number): Promise<Wasd.Post[]> {
    return this._axios
      .get('v2/posts', {
        params: {
          user_id: user_id,
          limit: limit,
          offset: offset,
        },
      })
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  public async getSchedule(user_id: number): Promise<Wasd.Schedule[]> {
    return this._axios
      .get(`schedules/weekly/${user_id}`)
      .then(({ data }) => {
        return data.result
      })
      .catch((err) => this.errorHandler(err))
  }

  // TODO: add options to method
  public downloadLiveMediaStream(user_id: number): PassThrough {
    return this.downloadMediaByUrl(`https://cdn-curie.wasd.tv/live/${user_id}/tracks-v1a1/mono.m3u8`)
  }

  public downloadMediaByUrl(url: string): PassThrough {
    return m3u8stream(url)
  }

  public downloadVod(media_container: Wasd.MediaContainer): PassThrough {
    if (
      media_container.media_container_status !== 'STOPPED' &&
      media_container.media_container_type !== 'SINGLE' &&
      media_container.media_container_online_status !== 'PUBLIC'
    ) {
      throw new ApiError('MediaContanier must have status STOPPED and type SINGLE')
    }

    const archive_url = media_container.media_container_streams[0]?.stream_media[0]?.media_meta.media_archive_url

    if (archive_url === undefined) {
      throw new ApiError('Unable to fetch media url')
    }

    const download_url = archive_url?.replace('/index-', '/tracks-v1a1/index-').replace('cdn.wasd.tv', 'cdn-volta.wasd.tv') as string
    return this.downloadMediaByUrl(download_url)
  }

  public async getMediaStreamMetadata(user_id: number): Promise<Wasd.MediaStreamMetadata> {
    return axios
      .get(`https://cdn.wasd.tv/live/${user_id}/index.m3u8`)
      .then(({ data }) => {
        const parse = {
          bandwidth: data
            .match(/(,BANDWIDTH=[0-9]*)/gm)
            ?.at(0)
            ?.replace(',BANDWIDTH=', ''),
          average_bandwidth: data
            .match(/(,AVERAGE-BANDWIDTH=[0-9]*)/gm)
            .at(0)
            ?.replace(',AVERAGE-BANDWIDTH=', ''),
          codecs: data
            .match(/(,CODECS=".*")/gm)
            ?.at(0)
            ?.replace(',CODECS="', '')
            .replace('"', ''),
          resolution: data
            .match(/(,RESOLUTION=[0-9]*x[0-9]*)/gm)
            ?.at(0)
            ?.replace(',RESOLUTION=', ''),
          closed_captions: data
            .match(/(,CLOSED-CAPTIONS=[A-Z]*)/gm)
            ?.at(0)
            ?.replace(',CLOSED-CAPTIONS=', ''),
          frame_rate: data
            .match(/(,FRAME-RATE=[0-9]*\.[0-9]*)/gm)
            ?.at(0)
            ?.replace(',FRAME-RATE=', ''),
          source_url: data.match(/(https:\/\/.*m3u8)/gm)?.at(0),
        }

        return {
          bandwidth: parse.bandwidth ? Number(parse.bandwidth) : undefined,
          average_bandwidth: parse.average_bandwidth ? Number(parse.average_bandwidth) : undefined,
          codecs: parse.codecs,
          resolution: parse.resolution,
          closed_captions: parse.closed_captions,
          frame_rate: parse.frame_rate ? Number(parse.frame_rate) : undefined,
          source_url: parse.source_url,
        }
      })
      .catch((err) => {
        this.errorHandler(err)
        return {
          bandwidth: undefined,
          average_bandwidth: undefined,
          codecs: undefined,
          resolution: undefined,
          closed_captions: undefined,
          frame_rate: undefined,
          source_url: undefined,
        }
      })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private errorHandler(err: any) {
    if (err instanceof AxiosError) {
      if (err.response?.data?.error !== undefined) {
        throw new ApiError(JSON.stringify(err.response.data.error, null, 2))
      } else {
        console.log(err)
        throw new HttpError(err.message)
      }
    }
  }
}
