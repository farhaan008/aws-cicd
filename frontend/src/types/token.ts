export interface Token {
  at_hash: string
  sub: string
  aud: string
  'cognito:groups'?: string[]
  'cognito:username': string
  token_use: string
  auth_time: number
  iss: string
  exp: number
  iat: number
  email: string
  identities: Array<{
    userId: string
    providerName: string
    providerType: string
    issuer: string
    primary: boolean
    dateCreated: string
  }>
}
