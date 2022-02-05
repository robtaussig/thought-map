import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Thought } from '~store/rxdb/schemas/types';
import { withStyles } from '@material-ui/core/styles';
import { pictures as pictureActions } from '../../../../../../actions/';
import { useLoadedDB } from '../../../../../../hooks/useDB';
import useLoadingOverlay from 'react-use-loading-overlay';
import TempImages from './TempImages';
import Images from './Images';
import { getBase64ImageFromUrl } from './util';
import { openConfirmation } from '../../../../../../lib/util';
import { styles } from './styles';
import { useSelector } from 'react-redux';
import { pictureSelector } from '../../../../../../reducers/pictures';

interface PictureProps {
  classes: any;
  onClose: () => void;
  thought: Thought;
}

const IMGUR_CLIENT_ID = 'f1b9f4565330211';
const BASE64_REGEX = /^data.*base64/;

export const Pictures: FC<PictureProps> = ({ classes, thought }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const loaded = useRef<boolean>(false);
  const uploadPictureRef = useRef<HTMLInputElement>(null);
  const { db } = useLoadedDB();
  const pictures = useSelector(pictureSelector);
  const [tempImages, setTempImages] = useState<any[]>([]);
  const { setLoading, stopLoading } = useLoadingOverlay(rootRef);
  const relatedPictures = useMemo(() =>
    Object.values(pictures)
      .filter(picture => picture.thoughtId === thought.id)
      .sort((a, b) => a.created - b.created)
  ,[pictures, thought]);

  useEffect(() => {
    const handleChange: EventListener = e => {
      setTempImages(prev => prev.concat(...Array.from((e.target as any).files).map<any>(URL.createObjectURL)));
    };
  
    uploadPictureRef.current.addEventListener('change', handleChange);

    return () => uploadPictureRef.current.removeEventListener('change', handleChange);
  }, []);

  const uploadImageLocally = (idx: number) => async () => {
    setLoading('Uploading Locally...');
    const base64: any = await getBase64ImageFromUrl(tempImages[idx]);

    await pictureActions.createPicture(db, {
      localUrl: base64,
      thoughtId: thought.id,
    });
    stopLoading();
    setTempImages(prev => prev.filter(prevImage => prevImage !== tempImages[idx]));
  };

  const uploadImageToImgur = (idx: number) => async () => {
    setLoading('Uploading to Imgur...');
    try {
      const base64: any = await getBase64ImageFromUrl(tempImages[idx]);
      const res = await fetch('https://api.imgur.com/3/image', {
        headers: {
          'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          image: base64.replace(BASE64_REGEX,''),
        }),
      });
      const rjson = await res.json();
      await pictureActions.createPicture(db, {
        imgurUrl: rjson.data.link,
        thoughtId: thought.id,
      });
      setTempImages(prev => prev.filter(prevImage => prevImage !== tempImages[idx]));
    } catch(e) {
      alert(e && e.message ? e.message : e);
    }
    stopLoading();
  };

  const deleteImage = (id: string) => async () => {
    const afterConfirm = async () => {
      setLoading('Deleting...');
      await pictureActions.deletePicture(db, id);
      stopLoading();
    };

    openConfirmation('Are you sure you want to delete this?', afterConfirm);
  };

  useEffect(() => {
    loaded.current = true;
  }, []);

  return (
    <div ref={rootRef} className={classes.root}>
      <label className={classes.uploadInput}>
        Upload/take picture
        <input ref={uploadPictureRef} type="file" accept="image/*" id="file-input"/>
      </label>
      <div className={classes.thoughtsContainer}>
        <TempImages
          classes={classes}
          tempImages={tempImages}
          uploadImageLocally={uploadImageLocally}
          uploadImageToImgur={uploadImageToImgur}
          loaded={loaded.current}
        />
        <Images
          classes={classes}
          relatedPictures={relatedPictures}
          loaded={loaded.current}
          deleteImage={deleteImage}
        />
      </div>
    </div>
  );
};

export default withStyles(styles)(Pictures);
