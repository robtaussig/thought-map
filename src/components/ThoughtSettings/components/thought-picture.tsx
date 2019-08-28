import React, { FC, useRef, useEffect, useState, Fragment } from 'react';
import { Thought } from '~store/rxdb/schemas/types';
import { withStyles, StyleRules } from '@material-ui/core/styles';

interface ThoughtPictureProps {
  classes: any,
  onClose: () => void,
  thought: Thought,
}

interface ThoughtPicture {
  localUrl?: string,
  imgurUrl?: string,
  thoughtId: string,
  description?: string,
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
  thoughtPictureItem: {
    display: 'flex',
    flexDirection: 'column',
    margin: '15px 0',
  },
  thoughtPictureDescription: {

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

export const ThoughtPicture: FC<ThoughtPictureProps> = ({ classes, onClose, thought }) => {
  const uploadPictureRef = useRef<HTMLInputElement>(null);
  const [tempImages, setTempImages] = useState<any[]>([]);
  const [thoughtPictures, setThoughtPictures] = useState<ThoughtPicture[]>([]);
  useEffect(() => {
    const handleChange: EventListener = e => {
      setTempImages(prev => prev.concat(...Array.from(e.target.files).map<any>(URL.createObjectURL)));
    };
  
    uploadPictureRef.current.addEventListener('change', handleChange);

    return () => uploadPictureRef.current.removeEventListener('change', handleChange);
  }, []);

  const uploadImageLocally = (idx: number) => () => {
    setThoughtPictures(prev => prev.concat({
      localUrl: tempImages[idx],
      thoughtId: thought.id,
    }));
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
        {thoughtPictures.length > 0 && (<Fragment>
          <div className={classes.imageList}>
            {thoughtPictures.map((thoughtPicture, idx) => {
              return (
                <div key={`${idx}-thought-picture`} className={classes.thoughtPictureItem}>
                  <img src={thoughtPicture.localUrl || thoughtPicture.imgurUrl} className={classes.image}/>
                  <span className={classes.thoughtPictureDescription}>{thoughtPicture.description}</span>
                </div>
              );
            })}
          </div>
        </Fragment>)}
      </div>
    </div>
  );
};

export default withStyles(styles)(ThoughtPicture);
