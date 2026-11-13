/**
 * 「⋯」下拉靠 CSS 的 :hover / :focus-within 显形，Esc 原本关不掉它。
 *
 * 按 Esc 时给鼠标所在、或焦点所在的那个菜单根节点加上 `is-dismissed`（样式里把下拉藏起来），
 * 并把焦点移出去；鼠标离开或再次按下时摘掉，下一次悬停 / 点击照常打开。
 * 卡片和列表行共用：处理函数都从 event.currentTarget 拿菜单根节点，v-for 里也不用各存一份状态。
 */
let hoveredMenu: HTMLElement | null = null
let listening = false

export function dismissMenu(menu: HTMLElement): void {
  menu.classList.add('is-dismissed')
  const active = document.activeElement as HTMLElement | null
  if (active && menu.contains(active)) active.blur()
  menu.addEventListener('pointerdown', () => menu.classList.remove('is-dismissed'), {
    once: true
  })
}

function onWindowKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || !hoveredMenu) return
  if (!hoveredMenu.isConnected) {
    hoveredMenu = null
    return
  }
  dismissMenu(hoveredMenu)
}

export function useMenuEscape(): {
  onMenuEnter: (event: MouseEvent) => void
  onMenuLeave: (event: MouseEvent) => void
  onMenuKeydown: (event: KeyboardEvent) => void
} {
  if (!listening && typeof window !== 'undefined') {
    window.addEventListener('keydown', onWindowKeydown)
    listening = true
  }
  return {
    onMenuEnter: (event) => {
      hoveredMenu = event.currentTarget as HTMLElement
    },
    onMenuLeave: (event) => {
      const menu = event.currentTarget as HTMLElement
      if (hoveredMenu === menu) hoveredMenu = null
      menu.classList.remove('is-dismissed')
    },
    // 焦点在菜单里（点开或右键打开）时 Esc 冒泡到这里
    onMenuKeydown: (event) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      dismissMenu(event.currentTarget as HTMLElement)
    }
  }
}
