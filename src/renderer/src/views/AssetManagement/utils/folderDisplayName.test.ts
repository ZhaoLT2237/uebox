import { describe, expect, it } from 'vitest'
import { displayFolderName } from './folderDisplayName'

describe('displayFolderName', () => {
  it('根文件夹 ALL 显示成本地化名称，其他名字原样', () => {
    expect(displayFolderName('ALL', '全部')).toBe('全部')
    expect(displayFolderName('Textures', '全部')).toBe('Textures')
    expect(displayFolderName('all', 'All')).toBe('all')
    expect(displayFolderName(undefined, 'All')).toBe('')
  })
})
