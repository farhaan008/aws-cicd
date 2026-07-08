import type { State } from './state'

export const fosActions = {
  setMenuItems(this: State, items: any[]): void {
    console.log('Setting menu items:', items)
    this.menuItems = items
  },
}
