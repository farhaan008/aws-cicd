export function setCookie(name: string, value: string, time: number = 3600): void {
  const expires = new Date(Date.now() + time * 1000).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/`
}

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const part = parts.pop()
    const cookieValue = part ? part.split(';').shift() : undefined
    return cookieValue !== undefined ? cookieValue : null
  }
  return null
  // const cookies = document.cookie.split('; ');
  // for (const cookie of cookies) {
  //   const [cookieName, cookieValue] = cookie.split('=');
  //   if (cookieName === name) {
  //     return decodeURIComponent(cookieValue);
  //   }
  // }
  // return null;
}

export function deleteCookie(name: string): void {
  const date = new Date()
  date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=; expires=${date.toUTCString()}; path=/`
  // document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
