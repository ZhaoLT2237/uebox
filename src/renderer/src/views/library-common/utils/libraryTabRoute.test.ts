import { describe, expect, it } from 'vitest'
import { createLibraryTabRouteFactory } from './libraryTabRoute'

describe('createLibraryTabRouteFactory', () => {
  it('生成带领域前缀且不重复的 tab id', () => {
    const { createTabId } = createLibraryTabRouteFactory({
      tabIdPrefix: 'bp-tab',
      routeName: 'BlueprintEditor'
    })
    const id1 = createTabId()
    const id2 = createTabId()
    expect(id1).toMatch(/^bp-tab-[a-z0-9]+-[a-z0-9]+$/)
    expect(id1).not.toBe(id2)
  })

  it('构建携带 _tab_id 的编辑器路由', () => {
    const { buildEditorRoute } = createLibraryTabRouteFactory({
      tabIdPrefix: 'material-tab',
      routeName: 'MaterialEditor'
    })
    const route = buildEditorRoute('material-1')
    expect(route.name).toBe('MaterialEditor')
    expect(route.params).toEqual({ id: 'material-1' })
    expect(route.query._tab_id).toMatch(/^material-tab-/)
  })

  it('同一条目已开着编辑器标签页时沿用它的 _tab_id，不再新开', () => {
    const { buildEditorRoute } = createLibraryTabRouteFactory({
      tabIdPrefix: 'bp-tab',
      routeName: 'BlueprintEditor'
    })
    const router = {
      resolve: ({ params }: { params: { id: string } }) => ({
        path: `/blueprint-library/${params.id}`
      })
    }
    const openTabKeys = [
      '/blueprint-library',
      '/blueprint-library/bp-2?_tab_id=bp-tab-old-2',
      '/blueprint-library/bp-1?_tab_id=bp-tab-old-1'
    ]
    expect(buildEditorRoute('bp-1', { router, openTabKeys }).query._tab_id).toBe('bp-tab-old-1')
    // 没开过的条目照常新开
    expect(buildEditorRoute('bp-3', { router, openTabKeys }).query._tab_id).toMatch(/^bp-tab-/)
    expect(buildEditorRoute('bp-3', { router, openTabKeys }).query._tab_id).not.toBe('bp-tab-old-1')
  })
})
