
type payloadDataObject = {
  [key: string]: | number | string | payloadDataObject | number[] | null[] | undefined | boolean | null | string[]
};

export interface PayloadData {
  [key: string]: | number | string | payloadDataObject | number[] | null[] | undefined | boolean | null | string[]
}



export interface Data {
  [key: string]: number | string
}
