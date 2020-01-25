import { API } from './constants';
import { ab2str } from '../../../../hooks/useCrypto/util';
import { BackupResponse } from './types';

export const uploadChunk = async (chunk: ArrayBuffer, part: number, uuid: string): Promise<any> => {
  const response = await fetch(`${API}/thought-map/api/backup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      uuid,
      part,
      chunk: ab2str(chunk),
    }),
  });

  return response.json();
};

export const fetchBackup = async (uuid: string): Promise<BackupResponse> => {
  const res = await fetch(`${API}/thought-map/api/retrieve-backup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      uuid,
    }),
  });
  const jsonRes: BackupResponse = await res.json();

  return jsonRes;
}
