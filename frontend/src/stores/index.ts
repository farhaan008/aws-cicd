// import { useAppStore } from '@/stores/app'

// export const store = {
//   app: useAppStore(),
// }

import { useAppStore } from '@/stores/app'
export const store = {
  get app() {
    return useAppStore()
  }
}
