import { Decryptor } from './types';
import { str2ab } from '../../../../hooks/useCrypto/util';

export const chunkData = (data: string, numChunks: number): string[] => {
  const chunks: string[] = [];
  const chunkLength = Math.floor(data.length / numChunks);
  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkLength;
    const end = start + chunkLength;
    if (i === numChunks - 1) {
      chunks.push(data.slice(start));
    } else {
      chunks.push(data.slice(start, end));
    }
  }
  return chunks;
};

export const dechunkData = (chunks: string[]): string => {
  return chunks.reduce((dechunked, chunk) => dechunked + chunk, '');
};

export const buildDechunker = (decrypt: Decryptor) =>
  async (chunks: string[], privateKey: string): Promise<string> => {
    const final = await Promise.all(
      chunks
        .map(chunk => {
          return decrypt(str2ab(chunk), privateKey);
        })
    );

    return dechunkData(final);
  };
