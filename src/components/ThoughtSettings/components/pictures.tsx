import React, { FC, useRef, useEffect, useState, Fragment, useMemo } from 'react';
import { Thought } from '~store/rxdb/schemas/types';
import { AppState } from '../../../reducers';
import { withStyles, StyleRules } from '@material-ui/core/styles';
import { pictures as pictureActions } from '../../../actions/';
import { useLoadedDB } from '../../../hooks/useDB';
import { useModalDynamicState } from '../../../hooks/useModal';
import { useNestedXReducer } from '../../../hooks/useXReducer';
import useApp from '../../../hooks/useApp';
import { getBase64ImageFromUrl } from './util';

interface PictureProps {
  classes: any,
  onClose: () => void,
  thought: Thought,
}

const UPLOAD_OPTIONS_WIDTH = 50;

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  uploadInput: {
    flex: '0 0 40px',
  },
  header: {
    position: 'relative',
  },
  thoughtsContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  uploadHeader: {
    position: 'absolute',
    right: 0,
  },
  imageList: {
    display: 'flex',
    flexDirection: 'column',
  },
  imageItem: {
    display: 'flex',
    margin: '15px 0',
  },
  pictureItem: {
    display: 'flex',
    flexDirection: 'column',
    margin: '15px 0',
  },
  pictureDescription: {

  },
  image: {
    width: `calc(100% - ${UPLOAD_OPTIONS_WIDTH}px)`,
    height: 'auto',
    flex: 1,
  },
  uploadOptions: {
    flex: `0 0 ${UPLOAD_OPTIONS_WIDTH}px`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    '& > button': {
      borderBottom: '1px solid white',
      cursor: 'pointer',
      color: 'white',
      margin: '15px 0',
    },
  },
});

export const Pictures: FC<PictureProps> = ({ classes, onClose, thought }) => {
  const uploadPictureRef = useRef<HTMLInputElement>(null);
  const db = useLoadedDB();
  const state: AppState = useModalDynamicState();
  const { dispatch } = useApp();
  const [pictures, setPictures] = useNestedXReducer('pictures', state, dispatch);
  const [tempImages, setTempImages] = useState<any[]>([]);
  const relatedPictures = useMemo(() => Object.values(pictures).filter(picture => picture.thoughtId === thought.id),[pictures, thought]);

  useEffect(() => {
    const handleChange: EventListener = e => {
      setTempImages(prev => prev.concat(...Array.from(e.target.files).map<any>(URL.createObjectURL)));
    };
  
    uploadPictureRef.current.addEventListener('change', handleChange);

    return () => uploadPictureRef.current.removeEventListener('change', handleChange);
  }, []);

  const uploadImageLocally = (idx: number) => async () => {
    const base64: any = await getBase64ImageFromUrl(tempImages[idx]);

    await pictureActions.createPicture(db, {
      localUrl: base64,
      thoughtId: thought.id,
    });
    setTempImages(prev => prev.filter(prevImage => prevImage !== tempImages[idx]));
  };

  return (
    <div className={classes.root}>
      <label className={classes.uploadInput}>
        Upload/take picture
        <input ref={uploadPictureRef} type="file" accept="image/*" id="file-input"/>
      </label>
      <div className={classes.thoughtsContainer}>
        {tempImages.length > 0 && (<Fragment>
          <h2 className={classes.header}>Pictures<span className={classes.uploadHeader}>Upload</span></h2>
          <div className={classes.imageList}>
            {tempImages.map((objectUrl, idx) => {
              return (
                <div key={`${idx}-temp-image`} className={classes.imageItem}>
                  <img src={objectUrl} className={classes.image}/>
                  <div className={classes.uploadOptions}>
                    <button onClick={uploadImageLocally(idx)}>Local</button>
                    <button>Imgur</button>
                  </div>
                </div>
              );
            })}
          </div>
        </Fragment>)}
        {relatedPictures.length > 0 && (<Fragment>
          <div className={classes.imageList}>
            {relatedPictures.map((picture, idx) => {
              return (
                <div key={`${idx}-thought-picture`} className={classes.pictureItem}>
                  <img src={picture.localUrl || picture.imgurUrl} className={classes.image}/>
                  <span className={classes.pictureDescription}>{picture.description}</span>
                </div>
              );
            })}
          </div>
        </Fragment>)}
      </div>
    </div>
  );
};

export default withStyles(styles)(Pictures);
