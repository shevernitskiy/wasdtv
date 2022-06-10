/* eslint-disable @typescript-eslint/no-empty-interface */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Wasd {
  export type JWT = string

  /* ------------------------------ Socket Events ----------------------------- */

  // TODO: parse action types
  export type ChatAction = 'WRITE_TO_CHAT' | 'WRITE_TO_FOLLOWERS_CHAT'
  // TODO: parse event types
  export type ChatEventType = 'NEW_FOLLOWER'

  export interface ChatJoined {
    actions: ChatAction[]
    user_channel_role: Role
    other_roles: Role[]
    user_sticker_packs: number[]
    chat_settings: ChatSettings
  }

  export interface ChatSettings {
    goodbyeBetaGifts: string
  }

  export interface ChatSystemMessage {
    message: string
    meta: ChatSystemMeta
  }

  export interface ChatSystemMeta {}

  export interface ChatEvent {
    event_type: string
    id: string
    payload: ChatEventPayload
    message: string
  }

  export interface ChatEventPayload {
    user_id: number
    channel_id: number
    user_login: string
  }

  export interface ChatMessage extends Message {
    id: string
  }

  export interface ChatHighlightedMessage {
    id: string
    user_id: number
    user_login: string
    user_avatar: Image
    channel_id: number
    stream_id: number
    message: string
    is_follower: boolean
    user_channel_role: Role
    other_roles: Role[]
    date_time: Date
    price_amount: number
    price_code: string
  }

  export interface ChatSubscribe extends SubscribeMessage {}

  export interface ChatSticker extends Sticker {}

  export interface ChatGiftsV1 {
    id: string
    gift_code: string
    price_id: number
    stream_id: number
    channel_id: number
    customer_id: number
    gift_name: string
    gift_description: string
    amount: number
    send_at: Date
    gift_graid: number
    gift_animation: string
    gift_animation_retina: string
  }

  export interface ChatViewers {
    anon: number
    auth: number
    total: number
  }

  export type ChatDisconnect = string

  /* -------------------------------- Messages -------------------------------- */

  export type MessageType = 'MESSAGE' | 'EVENT' | 'STICKER' | 'GIFTS' | 'YADONAT' | 'SUBSCRIBE' | 'HIGHLIGHTED_MESSAGE'
  export type Role = 'CHANNEL_OWNER' | 'CHANNEL_FOLLOWER' | 'CHANNEL_USER' | 'CHANNEL_MODERATOR' | 'CHANEL_SUBSCRIBER'
  export type InfoType = Message | StickerMessage | HighlightedMessage | SubscribeMessage

  // TODO: EventMessage, GiftsMessage, YadonatMessage
  export interface RestMessage<T extends InfoType> {
    id: string
    type: string
    info: T
    date_time: Date
  }

  export interface MessageBase {
    user_id: number
    user_login: string
    channel_id: number
    other_roles: Role[]
  }

  export interface SubscribeMessage extends MessageBase {
    product_name: string
    product_code: string
    validity_months: number
  }

  export interface MessageExtra extends MessageBase {
    user_avatar: Image
    is_follower: boolean
    user_channel_role: string
    date_time: Date
    stream_id: number
    streamer_id: number
  }

  export interface Message extends MessageExtra {
    message: string
    hash: string
  }

  export interface StickerMessage extends MessageExtra {
    sticker: Sticker
    hash: string
  }

  export interface HighlightedMessage extends MessageBase {
    price_amount: number
    price_code: string
  }

  export interface Sticker {
    sticker_id: number
    sticker_image: Image
    sticker_name: string
    sticker_alias: string
    sticker_pack_id: number
    sticker_status: string | null
  }

  /* ------------------------------ Channel Info ------------------------------ */

  export interface ChannelInfo {
    channel: Channel
    media_container: MediaContainer | null
  }

  export interface Channel {
    created_at: Date
    deleted_at: Date | null
    updated_at: Date
    channel_id: number
    channel_name: string
    user_id: number
    followers_count: number
    channel_subscribers_count: number
    channel_is_live: boolean
    channel_description: string
    channel_description_enabled: boolean
    channel_donation_url: string
    channel_image: Image
    channel_status: string
    channel_subscription_seller: boolean
    channel_clips_count: number
    channel_alias: string | null
    channel_priority: number
    last_activity_date: Date
    meta: ChannelMeta
    channel_owner: ChannelOwner
    notification: boolean
    is_user_follower: boolean
    is_partner: boolean
  }

  export interface Image {
    large: string
    medium: string
    small: string
  }

  export interface ChannelOwner {
    created_at: Date
    deleted_at: Date | null
    updated_at: Date
    user_id: number
    user_login: string
    profile_description: string
    profile_image: Image
    profile_background: Image
    channel_id: number
    profile_is_live: boolean
  }

  export interface ChannelMeta {
    required_isso: boolean
  }

  export interface MediaContainer {
    media_container_id: number
    media_container_name: string
    media_container_description: string
    media_container_type: string
    media_container_status: string
    media_container_online_status: string
    user_id: number
    channel_id: number
    created_at: Date
    is_mature_content: boolean
    published_at: Date
    game: GameBase
    media_container_streams: MediaContainerStream[]
    tags: Tag[]
  }

  export interface MediaContainerExtra extends MediaContainer {
    media_container_user: MediaContainerUser
    media_container_channel: MediaContainerChannel
  }

  export interface GameBase {
    game_id: number
    game_name: string
    game_icon: Image
    game_color_hex: string
  }

  export interface Game extends GameBase {
    created_at: Date
    updated_at: Date
    deleted_at: null
    game_description: null | string
    game_image: Image
    viewers_count: number
    game_name_ru: null | string
    game_name_short: null
    game_name_short_ru: null
    game_background: Image
    game_asset_name: string
    stream_count: number
    videos_count: number
    channels_count: number
  }

  export interface MediaContainerStream {
    stream_id: number
    stream_total_viewers: number
    stream_current_viewers: number
    stream_current_active_viewers: number
    stream_media: StreamMedia[]
  }

  export interface StreamMedia {
    media_id: number
    media_type: MediaType
    media_meta: MediaMeta
    media_duration: number
    media_status: MediaStatus
  }

  export interface MediaMeta {
    media_url: string
    media_archive_url: string | null
    media_preview_url: string
    media_preview_images: Image
    media_preview_archive_images: string | null
  }

  export interface Tag {
    tag_id: number
    tag_name: string
    tag_description: string
    tag_meta: null
    tag_type: TagType
    tag_media_containers_online_count: number
  }

  export interface Gift {
    gift_code: string
    gift_name: string
    gift_description: string
    gift_images: GiftImages
    gift_price: number
    gift_price_id: number
    gift_currency: string
    display_price: string
    sender_league_required: boolean
    max_available_amount: number
    gift_cooldown: number
    disabled: boolean
    disabled_message: string
    gift_type: string
  }

  export interface GiftImages {
    gift_button_img: string
    gift_button_v2_img: string
    gift_disable_button_img: string
    gift_hover_img?: string
    gift_tooltip_img?: string
    gift_url: string
    gift_url_retina: string
  }

  export interface Product {
    product_id: number
    name: string
    code: string
    description: string
    prices: ProductPrice[]
    benefits: ProductBenefit[]
  }

  export interface ProductBenefit {
    name: string
    code: string
    meta: Partial<ProductMeta>
  }

  export interface ProductMeta {
    chat_icon_image: Image
    additional_description: string
    additional_title: string
    subscriber_images: SubscriberImage[]
    sticker_pack_id: number
    sticker_pack_name: string
    sticker_pack_image: Image
    sticker_pack_alias: string
    streamer_id: number
    sticker_pack_status: string
    sticker_pack_is_starting: boolean
    sticker_pack_comment: null
    stickers: Sticker[]
    sticker_pack_type?: string
  }

  export interface Image {
    large: string
    small: string
    medium: string
  }

  export interface SubscriberImage extends Image {
    type: string
    name: string
    period: number
  }

  export interface ProductPrice {
    price_id: number
    display_price: string
    payment_method_code: string
    amount: number
    currency_code: string
    period: null | string
    sale_type: string
  }

  export interface WebCustomBlock {
    title: string
    image: Image
    link: string
    text: string
    channel_id: number
    sorting_number: number
    block_type: string
    created_at: Date
    updated_at: Date
    id: number
  }

  export interface StickerPack {
    sticker_pack_id: number
    sticker_pack_name: string
    sticker_pack_alias: string
    sticker_pack_image: Image
    sticker_pack_status: StickerPackStatus
    sticker_pack_comment: null | string
    sticker_pack_is_starting: boolean
    sticker_pack_type: StickerPackType
    streamer_id: number
    stickers: Sticker[]
    sticker_pack_available: boolean
  }

  //TODO: parse StickerPackStatus
  export type StickerPackStatus = 'RESOLVED'

  //TODO: parse StickerPackType
  export type StickerPackType = 'default' | 'subscription_v2'

  export interface Clip {
    created_at: Date
    deleted_at: null
    updated_at: Date
    clip_id: number
    clip_title: string
    clip_media_container_id: number
    expire_at: Date
    clip_views_count: number
    clip_type: null
    clip_data: ClipData
    clip_mature_content: boolean
    clip_owner_profile_id: number
    clip_game_id: number
    clip_game_name: string
    clip_owner_login: string
    clip_channel: ClipChannel
  }

  export interface ClipChannel {
    created_at: Date
    deleted_at: null
    updated_at: Date
    channel_id: number
    channel_name: string
    user_id: number
    followers_count: number
    channel_subscribers_count: number
    channel_is_live: boolean
    channel_description: string
    channel_description_enabled: boolean
    channel_donation_url: null | string
    channel_image: Image
    channel_status: ChannelStatus
    channel_clips_count: number
    channel_alias: null
    channel_priority: number
    last_activity_date: Date
    meta: ClipMeta
  }

  export interface Image {
    large: string
    medium: string
    small: string
  }

  //TODO: Parse
  export type ChannelStatus = 'ACTIVE'

  export interface ClipMeta {}

  export interface ClipData {
    url: string
    start: number
    preview: Image
    duration: number
  }

  export interface MediaContainerChannel {
    created_at: Date
    deleted_at: null
    updated_at: Date
    channel_id: number
    channel_name: string
    user_id: number
    followers_count: number
    channel_subscribers_count: number
    channel_is_live: boolean
    channel_description: string
    channel_description_enabled: boolean
    channel_donation_url: null | string
    channel_image: Image
    channel_status: ChannelStatus
    channel_clips_count: number
    channel_alias: null
    channel_priority: number
    last_activity_date: Date
    meta: MediaContainerMeta
  }

  export interface MediaContainerMeta {}

  // TODO: parse all this
  export type MediaContainerOnlineStatus = 'PUBLIC'
  export type MediaStatus = 'RUNNING' | 'STOPPED'
  export type MediaType = 'HLS'
  export type MediaContainerType = 'SINGLE'
  export type TagType = 'DEFAULT' | 'RECOMMENDATION' | 'WARNING'

  export interface MediaContainerUser {
    created_at: Date
    deleted_at: Date | null
    updated_at: Date
    user_id: number
    user_login: string
    profile_description: string
    profile_image: Image
    profile_background: Image
    channel_id: number
    profile_is_live: boolean
  }

  /* -------------------------------- EventMap -------------------------------- */

  //TODO: parse connect_error message
  export type EventMap = {
    connect: null
    connect_error: string
    disconnect: Wasd.ChatDisconnect
    joined: Wasd.ChatJoined
    system_message: Wasd.ChatSystemMessage
    event: Wasd.ChatEvent
    giftsV1: Wasd.ChatGiftsV1
    viewers: Wasd.ChatViewers
    message: Wasd.ChatMessage
    highlighted_message: Wasd.ChatHighlightedMessage
    subscribe: Wasd.ChatSubscribe
    sticker: Wasd.ChatSticker
  }

  export interface MediaStreamMetadata {
    bandwidth?: number
    average_bandwidth?: number
    codecs?: string
    resolution?: string
    closed_captions?: string
    frame_rate?: number
    source_url?: string
  }

  export enum ChatPermission {
    ALL = '0',
    ONLY_FOLLOWERS = '1',
    ONLY_SUBSCRIBERS = '2',
  }

  export enum ChatDelay {
    '0s' = '0',
    '5s' = '5',
    '10s' = '10',
    '30s' = '30',
    '60s' = '60',
  }

  export interface Moderator {
    user_id: number
    user_login: string
    user_channel_role: Role
    online: boolean
  }

  export interface BannedUser {
    channel_id: number
    streamer_id: number
    streamer_login: string
    user_id: number
    user_login: string
    user_channel_role: string
    by_user_id: number
    by_user_login: string
    user_avatar: Image
    reason: string
    created_at: Date
    expire_at: null
    online: boolean
  }
}
