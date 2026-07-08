// stores/user/index.ts
import { defineStore } from 'pinia'
import { fosState } from './state'
import { fosActions } from './actions'
import { fosGetters } from './getters'

export const useFosStore = defineStore('fos', {
  state: fosState,
  getters: fosGetters as any,
  actions: fosActions as any,
})

// export type UserStore = ReturnType<typeof useUserStore>;
