import axios, { AxiosInstance, AxiosError } from 'axios'

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

  public async getChannelInfo(streamer_alias: string): Promise<Wasd.ChannelInfo> {
    return this._axios
      .get('v2/broadcasts/public', {
        params: {
          channel_name: streamer_alias,
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

  private errorHandler(err: AxiosError) {
    if (err instanceof AxiosError) {
      if (err.response?.data?.error !== undefined) {
        throw new ApiError(JSON.stringify(err.response.data.error, null, 2))
      } else {
        throw new HttpError(err.message)
      }
    }
  }
}
