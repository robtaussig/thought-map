import { API } from './constants';
import { ab2str } from '../../../../hooks/useCrypto/util';
import { BackupResponse } from './types';

export const uploadChunk = async (chunk: ArrayBuffer, part: number, uuid: string, password = '', nextVersion: number): Promise<any | Error> => {
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
            password,
            version: nextVersion,
        }),
    });
    if (!res.ok) return new Error(res.statusText);

    return true;
};

export const updateChunk = async (chunk: ArrayBuffer, part: number, uuid: string, password = '', nextVersion: number, numChunks: number): Promise<any | Error> => {
    const res = await fetch(`${API}/thought-map/api/backup`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            uuid,
            part,
            chunk: ab2str(chunk),
            password,
            version: nextVersion,
            numChunks,
        }),
    });
    if (!res.ok) return new Error(res.statusText);

    return true;
};

export const fetchBackup = async (uuid: string, password = ''): Promise<BackupResponse | Error> => {
    const res = await fetch(`${API}/thought-map/api/retrieve-backup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            uuid,
            password,
        }),
    });
  
    if (!res.ok) return new Error(res.statusText);

    return res.json();
};

export const getVersion = async (uuid: string): Promise<{ version: number }> => {
    const res = await fetch(`${API}/thought-map/api/latest-version/${uuid}?date=${+new Date()}`, {
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!res.ok) return { version: null };
    return res.json();
};
