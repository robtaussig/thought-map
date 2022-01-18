export async function getBase64ImageFromUrl(imageUrl: string): Promise<string | ArrayBuffer> {
  const res = await fetch(imageUrl);
  const blob = await res.blob();

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
}
