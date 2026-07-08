export interface Notify {
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  title?: string
  message?: string
  persist?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}
