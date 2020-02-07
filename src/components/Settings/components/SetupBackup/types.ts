export interface BackupResponse {
  chunks: string[];
  version: number;
}

export type Decryptor = (data: ArrayBuffer, key: string) => Promise<string>;

export enum SetupStages {
  Id,
  Password,
  PrivateKey,
}
