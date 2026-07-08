import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

// import jwtDecode from 'jwt-decode'

// import type { Token } from '@/types/token'
import { getCookie, setCookie } from '@/utils/global/cookies-helper'

let hasToken = false

// var to ensure the global startup guard runs only once
let isInitialized: boolean = false

function createSession(path: string): boolean {
  let sessionCreated = false
  try {
    const idToken: Array<string> = path.split('id_token=')
    if (idToken && idToken.length < 2) {
      sessionCreated = false
    } else {
      const token = idToken[1].split('&')[0]
      const time = parseInt(token[3].split('expires_in=')[1], 10)
      if (token && token.length < 4) {
        sessionCreated = false
      } else {
        // const jwtToken = token[0]
        // const decodedToken: Token = jwtDecode(jwtToken)
        // if (decodedToken && decodedToken?.identities && decodedToken?.identities.length > 0) {
        //   console.log(decodedToken.identities)
        //   localStorage.setItem('id', decodedToken.identities[0].userId)
        //   localStorage.setItem('email', decodedToken.email)
        //   localStorage.setItem(
        //     'sessionTime',
        //     new Date(new Date().getTime() + (time - 300)).toISOString(),
        //   )
        //   setCookie('token', jwtToken, time)
        //   sessionCreated = true
        // }
      }
    }
  } catch (error) {
    console.error('Error creating session:', error)
    sessionCreated = false
  }
  return sessionCreated
}

function loadSession(): boolean {
  const token = getCookie('token')
  if (token) {
    return true
  } else {
    return false
  }
}

function handleGuestPages(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void {
  if (to.path === '/') {
    if (hasToken) {
      next({ path: '/home', query: from.query })
    } else {
      next({ name: 'login' })
    }
  } else if (hasToken) {
    next({ path: '/home', query: from.query })
  } else {
    next()
  }
}

export function authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  next()
  // hasToken = loadSession()
  // if (to.path === '/login' && !hasToken) {
  //   next()
  // } else if (to.meta.guest === true) {
  //   hasToken = false
  //   handleGuestPages(to, from, next)
  // } else if (!hasToken) {
  //   next({ name: 'login' })
  // } else {
  //   next()
  // }
}

export async function globalStartupGuard(to: RouteLocationNormalized): Promise<boolean | undefined> {
  if (hasToken === false) {
    hasToken = createSession(to.fullPath)
    isInitialized = true
  }
  if (isInitialized) {
    return isInitialized
  }
  if (!hasToken) {
    isInitialized = false
    return isInitialized
  }
}
