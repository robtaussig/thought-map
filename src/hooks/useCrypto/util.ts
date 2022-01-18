export const PRIVATE_KEY_START = '-----BEGIN PRIVATE KEY-----\n';
export const PRIVATE_KEY_END = '\n-----END PRIVATE KEY-----';

export const ab2str = (buf: ArrayBuffer): string => {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

export const str2ab = (str: string): ArrayBuffer => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

export const exportCryptoKey = async (key: CryptoKey): Promise<ArrayBuffer> => {
  const exported = await crypto.subtle.exportKey(
    'raw',
    key
  );
  const exportedKeyBuffer = new Uint8Array(exported);

  return exportedKeyBuffer;
};

export const generateKey = async (iv: Uint8Array): Promise<string> => {
  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );

  const exported = await exportCryptoKey(key);
  const privateKeyContents = btoa(ab2str(exported));
  const ivContents = btoa(ab2str(iv));
  return `${PRIVATE_KEY_START}${privateKeyContents}\n${ivContents}${PRIVATE_KEY_END}`;
};

export const importKey = async (key: string): Promise<[CryptoKey, ArrayBuffer]> => {
  const stripped = key.slice(PRIVATE_KEY_START.length, key.length - PRIVATE_KEY_END.length);
  const [privateKey, iv] = stripped.trim().split(/\s+/);
  const rawKey = str2ab(atob(privateKey));
  const ivBuffer = str2ab(atob(iv));
  const imported = await crypto.subtle.importKey(
    'raw',
    rawKey,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  );

  return [imported, ivBuffer];
};

export const generatePrivateKey = async (): Promise<string> => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const privateKey = await generateKey(iv);
  return privateKey;
};

export const encrypt = async (str: string, privateKey: string): Promise<any> => {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  const [key, importedIv] = await importKey(privateKey);
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: importedIv
    },
    key,
    encoded
  );

  return encrypted;
};

export const decrypt = async (ciphertext: ArrayBuffer, privateKey: string): Promise<string> => {
  const [key, iv] = await importKey(privateKey);
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    ciphertext
  );

  return ab2str(decrypted);
};
