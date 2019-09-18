import React, { FC, Fragment, useCallback, useState } from 'react';
import { Picture } from 'store/rxdb/schemas/picture';
import ImageWrapper from './ImageWrapper';
import Delete from '@material-ui/icons/Delete';
import FullScreenImage from './FullScreenImage';

interface ImagesProps {
  classes: any;
  relatedPictures: Picture[];
  loaded: boolean;
  deleteImage: (id: string) => () => Promise<any>;
}

export const Images: FC<ImagesProps> = ({ classes, relatedPictures, loaded, deleteImage }) => {
  const [fullScreenImage, setFullScreenImage] = useState<Picture>(null);
  const handleClickImage = (idx: number) => () => {
    const picture = relatedPictures[idx];
    setFullScreenImage(picture);
  };

  const handleCloseFullScreenImage = useCallback(() => {
    setFullScreenImage(null);
  }, []);

  return (
    <Fragment>
      {relatedPictures.length > 0 && (<div className={classes.imageList}>
        {relatedPictures.map((picture, idx) => {
          return (
            <ImageWrapper key={`${idx}-thought-picture`} className={classes.pictureItem} loaded={loaded}>
              {/* 
              // @ts-ignore */}
              <img src={picture.localUrl || picture.imgurUrl} className={classes.image} loading="lazy" onClick={handleClickImage(idx)}/>
              <div className={classes.uploadOptions}>
                <button className={classes.deleteButton} onClick={deleteImage(picture.id)}><Delete/></button>
              </div>
              <span className={classes.pictureDescription}>{picture.description}</span>
            </ImageWrapper>
          );
        })}
      </div>)}
      {fullScreenImage && (
        <FullScreenImage onClose={handleCloseFullScreenImage} image={fullScreenImage.localUrl || fullScreenImage.imgurUrl}/>
      )}
    </Fragment>
  )
};

export default Images;
