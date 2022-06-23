import io from 'socket.io-client'
import EventEmitter from 'events'

import { Wasd } from '../types/api'
import { SocketError } from '../core/error'

export default class SocketClient extends EventEmitter {
  private heartbeat = 25
  public socketio!: SocketIOClient.Socket
  private _subs: (keyof Wasd.EventMap)[] = []
  private _originalOn = EventEmitter.prototype.on
  private _originalOff = EventEmitter.prototype.off

  constructor(private jwt: Wasd.JWT) {
    super()
    try {
      this.socketio = io('wss://chat.wasd.tv', {
        path: '/socket.io',
        transports: ['websocket'],
        query: {
          EIO: 3,
        },
      })
    } catch (err) {
      this.errorHandler(err as Error)
    }
  }

  private connect(cb?: CallableFunction): void {
    try {
      this.socketio = io('wss://chat.wasd.tv', {
        path: '/socket.io',
        transports: ['websocket'],
        query: {
          EIO: 3,
        },
      })
    } catch (err) {
      this.errorHandler(err as Error)
    }
    this.listen(cb)
  }

  public join(stream_id: number, channel_id: number): void {
    if (this.socketio?.connected) {
      this.socketio.emit('join', {
        streamId: stream_id,
        channelId: channel_id,
        jwt: this.jwt,
        excludeStickers: true,
      })
    } else {
      this.connect(() => {
        this.join(stream_id, channel_id)
      })
    }
  }

  public leave(stream_id: number): void {
    if (this.socketio?.connected) {
      this.socketio.emit('leave', {
        streamId: stream_id,
      })
    } else {
      this.connect(() => {
        this.leave(stream_id)
      })
    }
  }

  public sendMessage(stream_id: number, message: string, channel_id: number, streamer_id: number): void {
    if (this.socketio?.connected) {
      this.socketio.emit('message', {
        channelId: channel_id,
        hash: this.messageHash(),
        jwt: this.jwt,
        message: message,
        streamId: stream_id,
        streamerId: streamer_id,
      })
    } else {
      throw new SocketError('Socket is not connected at this moment. Use this method only after "joined" event.')
    }
  }

  public sendSticker(stream_id: number, sticker_id: number, channel_id: number, streamer_id: number): void {
    if (this.socketio?.connected) {
      this.socketio.emit('sticker', {
        channel_id: channel_id,
        hash: this.messageHash(),
        sticker_id: sticker_id,
        stream_id: stream_id,
        streamer_id: streamer_id,
      })
    } else {
      throw new SocketError('Socket is not connected at this moment. Use this method only after "joined" event.')
    }
  }

  private messageHash(length = 25): string {
    let result = ''
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return result
  }

  private listen(cb?: CallableFunction): void {
    this.socketio.on('connect', () => {
      this.ping()
      if (cb !== undefined) {
        cb()
      }
      this.emit('connect', null)
      console.log('connected')

      this._subs.forEach((event) => {
        this.socketio.on(event, (ctx: Wasd.EventMap[typeof event]) => {
          this.emit(event, ctx)
        })
      })
    })
  }

  public on<T extends Wasd.EventMap, V extends keyof Wasd.EventMap>(event: V, listener: (ctx: Pick<T, V>[V]) => void): this {
    this._subs.push(event)

    return this._originalOn(event, listener) as this
  }

  public off<T extends Wasd.EventMap, V extends keyof Wasd.EventMap>(event: V, listener: (ctx: Pick<T, V>[V]) => void): this {
    this._subs = this._subs.filter((e) => e !== event)

    return this._originalOff(event, listener) as this
  }

  private ping(): void {
    setTimeout(() => {
      if (this.socketio.connected) {
        this.socketio.send(2)
        this.ping()
      }
    }, this.heartbeat * 1000)
  }

  private errorHandler(err: Error): void {
    throw new SocketError(`${err.name}: ${err.message}`)
  }
}
