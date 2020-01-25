import { encrypt, decrypt, generatePrivateKey } from './util';

export const useCrypto = () => {
  return { encrypt, decrypt, generatePrivateKey };
};

export default useCrypto;
