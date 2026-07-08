import { store } from '@/stores'

export const showToast = (msg: string, isSuccess: boolean): void => {
  store.app.showToast({
    type: isSuccess ? 'success' : 'error',
    title: isSuccess ? 'Success' : 'Error',
    message: msg,
  })
}
export const showToastType = ( title: string, message:string, type: string): void => {
  store.app.showToast({ title, message, type})
}

