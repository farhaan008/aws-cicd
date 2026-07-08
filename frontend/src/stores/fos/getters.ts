import type { State } from './state'

export const fosGetters = {
  // userInfo(this: UserState): string {
  //   return `${this.name} (${this.email})`;
  // },
  getMenuItems: (state: State): any[] => {
    console.log('Getting menu items:', state.menuItems)
    return state.menuItems || []
  },
}
// import type { appState } from './state'

// export const appGetters = {

//   getMenuItems: (state: ReturnType<typeof appState>) => state.menuItems || [],

//   // getMenuItems: (state: IAppState): any[] => {
//   //   console.log('Getting menu items:', state.menuItems)
//   //   return state.menuItems || []
//   // },

//   // cartTotal: (state: IAppState) => (state.cart ?? []).reduce((total, item) => total + item.price * item.quantity, 0),
//   // cartCount: (state: IAppState) => (state.cart ?? []).reduce((count, item) => count + item.quantity, 0),

// }
