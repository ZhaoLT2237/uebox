import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { useTabsStore } from '@renderer/store/modules/tabs'
import { closeLibraryEditorTabs } from './closeEditorTabs'

function createTestRouter(): ReturnType<typeof createRouter> {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/blueprint-library', name: 'BlueprintGallery', component: { template: '<div />' } },
      {
        path: '/blueprint-library/:id',
        name: 'BlueprintEditor',
        component: { template: '<div />' }
      }
    ]
  })
}

describe('closeLibraryEditorTabs', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('关掉被删条目的所有编辑器标签页，别的标签页不动', async () => {
    const router = createTestRouter()
    const tabsStore = useTabsStore()
    tabsStore.historyTabs = [
      {
        key: '/blueprint-library',
        title: 'g',
        path: '/blueprint-library',
        sort: 1,
        isCanDelete: true
      },
      {
        key: '/blueprint-library/bp1?_tab_id=a',
        title: 'a',
        path: '/blueprint-library/bp1',
        sort: 2,
        isCanDelete: true
      },
      {
        key: '/blueprint-library/bp1?_tab_id=b',
        title: 'b',
        path: '/blueprint-library/bp1',
        sort: 3,
        isCanDelete: true
      },
      {
        key: '/blueprint-library/bp2?_tab_id=c',
        title: 'c',
        path: '/blueprint-library/bp2',
        sort: 4,
        isCanDelete: true
      }
    ]
    tabsStore.setActiveTab('/blueprint-library')

    await closeLibraryEditorTabs({ router, routeName: 'BlueprintEditor', id: 'bp1' })

    expect(tabsStore.historyTabs.map((tab) => tab.key)).toEqual([
      '/blueprint-library',
      '/blueprint-library/bp2?_tab_id=c'
    ])
    expect(tabsStore.activeTab).toBe('/blueprint-library')
  })
})
