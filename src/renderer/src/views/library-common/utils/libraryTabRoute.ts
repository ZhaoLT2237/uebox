/**
 * 库类页面"专用编辑器 tab"路由的工厂。
 *
 * 蓝图库与材质库各自有一条 `列表页 + :id 编辑器子路由` 的路由结构，编辑器可携带
 * `_tab_id` 查询参数成为独立 tab 实例。两个库的 tabRoute 工具曾经是两份 100%
 * 同构的复制代码，现统一由本工厂生成。
 */

export interface LibraryTabRouteFactory {
  /** 生成一次性的 `_tab_id`（前缀 + 时间戳 + 随机串） */
  createTabId: () => string
  /**
   * 构造打开编辑器并独占 tab 的路由位置对象（供 router.push 使用）。
   * 传了 reuse 且该条目已有打开的编辑器标签页时，沿用那个标签页的 `_tab_id`，
   * 打开同一条目只激活已有标签页，不再新开。
   */
  buildEditorRoute: (id: string, reuse?: LibraryEditorTabReuse) => LibraryEditorRouteLocation
}

export interface LibraryEditorTabReuse {
  router: { resolve: (to: { name: string; params: { id: string } }) => { path: string } }
  /** 当前所有标签页的 key（形如 `path?_tab_id=xxx`） */
  openTabKeys: readonly string[]
}

export interface LibraryEditorRouteLocation {
  name: string
  params: { id: string }
  query: { _tab_id: string }
}

export function createLibraryTabRouteFactory(options: {
  tabIdPrefix: string
  routeName: string
}): LibraryTabRouteFactory {
  const { tabIdPrefix, routeName } = options

  function createTabId(): string {
    const timestamp = Date.now().toString(36)
    const randomSuffix = Math.random().toString(36).slice(2, 8)
    return `${tabIdPrefix}-${timestamp}-${randomSuffix}`
  }

  function findOpenTabId(id: string, reuse: LibraryEditorTabReuse): string | null {
    const editorPath = reuse.router.resolve({ name: routeName, params: { id } }).path
    for (const key of reuse.openTabKeys) {
      const [path, query = ''] = key.split('?')
      if (path !== editorPath) continue
      const tabId = new URLSearchParams(query).get('_tab_id')
      if (tabId) return tabId
    }
    return null
  }

  function buildEditorRoute(id: string, reuse?: LibraryEditorTabReuse): LibraryEditorRouteLocation {
    return {
      name: routeName,
      params: { id },
      query: {
        _tab_id: (reuse && findOpenTabId(id, reuse)) || createTabId()
      }
    }
  }

  return { createTabId, buildEditorRoute }
}
