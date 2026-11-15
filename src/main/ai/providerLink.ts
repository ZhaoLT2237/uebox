/**
 * 中转站网页「聊天 → UEBox」：`unrealbox://add-provider?key=sk-…`。
 *
 * 链接里只取 Key，地址固定是本应用的中转站。主进程不写配置：把 Key 交给设置页，
 * 设置页开一个预填好的新服务商、拉好模型列表，用户点「保存」才落盘 ——
 * 链接谁都能发，不能没经用户确认就往配置里加东西。
 *
 * 冷启动从链接唤起时界面后到，请求先挂着，设置页打开时取。
 */

import { findMainWindow } from '../appWindows'
import { CREATOR_PLAN_ORIGIN } from './creatorPlan/endpoint'
import type { ProviderLinkRequest } from '../../shared/aiProvider'

export const PROVIDER_LINK_CHANNEL = 'ai-provider:link'

const KEY_PATTERN = /^(sk-)?[A-Za-z0-9_-]{16,128}$/

let pending: ProviderLinkRequest | null = null

/** 设置页取走挂着的请求；取一次就没了 */
export function takeProviderLink(): ProviderLinkRequest | null {
  const request = pending
  pending = null
  return request
}

export function hasProviderLink(): boolean {
  return pending !== null
}

export function handleProviderDeepLink(raw: string): boolean {
  if (!/^unrealbox:\/\/add-provider/i.test(raw)) return false
  let key = ''
  try {
    key = new URL(raw).searchParams.get('key')?.trim() ?? ''
  } catch {
    /* 下面按 Key 无效处理 */
  }
  if (!KEY_PATTERN.test(key)) return true
  pending = {
    displayName: 'UEBox',
    baseUrl: `${CREATOR_PLAN_ORIGIN}/v1`,
    apiKey: key.startsWith('sk-') ? key : `sk-${key}`
  }
  const window = findMainWindow()
  if (window && !window.isDestroyed()) {
    window.webContents.send(PROVIDER_LINK_CHANNEL)
    if (window.isMinimized()) window.restore()
    window.show()
    window.focus()
  }
  return true
}
