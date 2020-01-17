import { encrypt, decrypt } from './util';

export const useCrypto = () => {
  return { encrypt, decrypt };
};

export default useCrypto;
