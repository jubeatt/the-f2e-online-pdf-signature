export enum Colors {
  black = '#000000',
  blue = '#0038a6',
  red = '#ff0000'
}

export type SignatureItem = {
  id: string
  src: string
}

export type TableRow = {
  id: string
  name: string
  uploadTime: string
  lastTimeOpen: string | null
}

export type DocsData = {
  id: string
  data: ArrayBuffer
}
