import {
  createLibraryTabRouteFactory,
  type LibraryEditorRouteLocation,
  type LibraryEditorTabReuse
} from '@renderer/views/library-common/utils/libraryTabRoute'

/** 材质编辑器"专用 tab"路由工具（实现见 library-common 工厂） */
const factory = createLibraryTabRouteFactory({
  tabIdPrefix: 'material-tab',
  routeName: 'MaterialEditor'
})

export function createMaterialTabId(): string {
  return factory.createTabId()
}

export function buildMaterialEditorRoute(
  id: string,
  reuse?: LibraryEditorTabReuse
): LibraryEditorRouteLocation {
  return factory.buildEditorRoute(id, reuse)
}
