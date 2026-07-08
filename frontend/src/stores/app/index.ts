import { defineStore } from 'pinia'
import { state } from './state'
import { actions } from './action'
import { getters } from './getters'

export const useAppStore = defineStore('app', {
  state: state,
  getters: getters as any,
  actions: actions as any,
})
