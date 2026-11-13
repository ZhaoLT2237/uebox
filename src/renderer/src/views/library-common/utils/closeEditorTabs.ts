import type { Router } from 'vue-router'

import { useTabsStore } from '@renderer/store/modules/tabs'

/**
 * 条目删掉后，关掉它的编辑器标签页（同一条目可能开了好几个专用 tab）。
 * 关的是当前标签页时，切到标签栏给出的下一个。
 */
export async function closeLibraryEditorTabs(options: {
  router: Router
  routeName: string
  id: string
}): Promise<void> {
  const { router, routeName, id } = options
  const editorPath = router.resolve({ name: routeName, params: { id } }).path
  const tabsStore = useTabsStore()
  for (const tab of [...tabsStore.historyTabs]) {
    if (tab.key.split('?')[0] !== editorPath) continue
    const wasActive = tab.key === tabsStore.activeTab
    const next = tabsStore.removeTab(tab.key)
    if (next && wasActive) {
      tabsStore.setActiveTab(next)
      await router.push(next).catch(() => undefined)
    }
  }
}
