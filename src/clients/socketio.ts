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
