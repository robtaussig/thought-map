export async function getBase64ImageFromUrl(imageUrl: string) {
  const res = await fetch(imageUrl);
  return res.blob();
}

export const convertBlobToDataUrl = (blob: Blob): Promise<string | ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader  = new FileReader();
    reader.addEventListener('load', function () {
      resolve(reader.result);
    }, false);

    reader.onerror = () => {
      return reject(this);
    };
    reader.readAsDataURL(blob);
  });
};
