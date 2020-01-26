import { API } from './constants';
import { ab2str } from '../../../../hooks/useCrypto/util';
import { BackupResponse } from './types';

export const uploadChunk = async (chunk: ArrayBuffer, part: number, uuid: string): Promise<any | Error> => {
  const res = await fetch(`${API}/thought-map/api/backup`, {
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
  if (!res.ok) return new Error(res.statusText);

  return true;
};

export const fetchBackup = async (uuid: string): Promise<BackupResponse | Error> => {
  const res = await fetch(`${API}/thought-map/api/retrieve-backup/${uuid}`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  if (!res.ok) return new Error(res.statusText);

  return res.json();
}
