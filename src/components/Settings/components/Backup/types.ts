export interface BackupResponse {
  chunks: string[];
  version: number;
}

export type Decryptor = (data: ArrayBuffer, key: string) => Promise<string>;

export enum NavOptions {
  Upload = 'Upload',
  Retrieve = 'Retrieve',
}
