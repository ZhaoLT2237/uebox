/** @vitest-environment node */
import { beforeEach, describe, expect, it, vi } from 'vitest'

const sent: string[] = []
vi.mock('../appWindows', () => ({
  findMainWindow: () => ({
    isDestroyed: () => false,
    isMinimized: () => false,
    restore: () => {},
    show: () => {},
    focus: () => {},
    webContents: { send: (channel: string) => sent.push(channel) }
  })
}))

const { handleProviderDeepLink, hasProviderLink, takeProviderLink } = await import('./providerLink')
const { CREATOR_PLAN_ORIGIN } = await import('./creatorPlan/endpoint')

// 拼出来的假 Key：整串写死会被密钥扫描当成真的
const KEY = `sk-${'test'.repeat(8)}`

beforeEach(() => {
  sent.length = 0
  takeProviderLink()
})

describe('unrealbox://add-provider', () => {
  it('不认别的 unrealbox 链接', () => {
    expect(handleProviderDeepLink('unrealbox://install-skill?id=x')).toBe(false)
  })

  it('挂起一个指向本应用中转站的服务商，通知界面；取一次就没了', () => {
    expect(handleProviderDeepLink(`unrealbox://add-provider?key=${KEY}`)).toBe(true)
    expect(sent).toEqual(['ai-provider:link'])
    expect(hasProviderLink()).toBe(true)
    expect(takeProviderLink()).toEqual({
      displayName: 'UEBox',
      baseUrl: `${CREATOR_PLAN_ORIGIN}/v1`,
      apiKey: KEY
    })
    expect(takeProviderLink()).toBeNull()
  })

  it('没带 sk- 的补上', () => {
    handleProviderDeepLink(`unrealbox://add-provider?key=${'test'.repeat(8)}`)
    expect(takeProviderLink()?.apiKey).toBe(KEY)
  })

  it('Key 不对：吃掉链接，什么都不挂', () => {
    expect(handleProviderDeepLink('unrealbox://add-provider?key=bad key')).toBe(true)
    expect(hasProviderLink()).toBe(false)
    expect(sent).toEqual([])
  })
})
