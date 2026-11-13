import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import zhCN from '@renderer/i18n/locales/zh-CN'

const source = readFileSync(
  'src/renderer/src/views/System/Preferences/panels/ProfilePlugin.vue',
  'utf8'
)

describe('插件页桥接状态', () => {
  it('正文不写端口，端口放进悬停提示', () => {
    expect(zhCN.profile.plugin.bridgeListening).toBe('等待虚幻引擎连接。')
    expect(source).toContain("$t('profile.plugin.bridgePort', { port: bridge.port })")
    expect(source).toContain("{{ $t('profile.plugin.bridgeListening') }}")
  })
})
