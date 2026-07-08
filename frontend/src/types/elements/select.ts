type GenricArray = {
  [key: string]: number | string | boolean | null
}

export interface IVSelect {
  [key: string]: number | string | boolean | null | Array<GenricArray>
}
