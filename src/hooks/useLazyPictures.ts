import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { pictureSelector } from '../reducers/pictures';
import { Picture } from '../store/rxdb/schemas/picture';
import { pictures as pictureActions } from '../actions';
import { useLoadedDB } from './useDB';
import { convertBlobToDataUrl } from '../components/Thought/components/sections/PicturesSection/components/util';

export const useLazyPictures = (thoughtId: string) => {
  const statePictures = useSelector(pictureSelector);
  const { db } = useLoadedDB();
  const [retrieved, setRetrieved] = useState<Picture[]>();

  useEffect(() => {
    const thoughtPictures = Object.values(statePictures).filter(p => p.thoughtId === thoughtId);
    const getLocalUrls = async () => {
      const result: Picture[] = [];
      for (const image of thoughtPictures) {
        if (image.imgurUrl) {
          result.push(image);
        } else {
          const img = await pictureActions.getAttachment(db, image.id);
          if (img) {
            const localUrl = await convertBlobToDataUrl(img) as string;
            if (localUrl) {
              result.push({
                ...image,
                localUrl,
              });
            }
          }
        }
      }

      setRetrieved(result);
    };

    getLocalUrls();
  }, [statePictures, thoughtId]);

  return retrieved;
};
