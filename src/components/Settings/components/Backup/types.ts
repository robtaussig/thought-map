export interface BackupResponse {
  chunks: string[]
}

export type Decryptor = (data: ArrayBuffer, key: string) => Promise<string>;

export enum NavOptions {
  Upload = 'Upload',
  Retrieve = 'Retrieve',
  Update = 'Update',
}
