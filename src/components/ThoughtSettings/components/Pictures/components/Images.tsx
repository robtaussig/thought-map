import React, { FC, Fragment } from 'react';
import { Picture } from 'store/rxdb/schemas/picture';
import ImageWrapper from './ImageWrapper';
import Delete from '@material-ui/icons/Delete';

interface ImagesProps {
  classes: any,
  relatedPictures: Picture[],
  loaded: boolean,
  deleteImage: (id: string) => () => Promise<any>
}

export const Images: FC<ImagesProps> = ({ classes, relatedPictures, loaded, deleteImage }) => {

  return (
    <Fragment>
      {relatedPictures.length > 0 && (<div className={classes.imageList}>
        {relatedPictures.map((picture, idx) => {
          return (
            <ImageWrapper key={`${idx}-thought-picture`} className={classes.pictureItem} loaded={loaded}>
              <img src={picture.localUrl || picture.imgurUrl} className={classes.image}/>
              <div className={classes.uploadOptions}>
                <button className={classes.deleteButton} onClick={deleteImage(picture.id)}><Delete/></button>
              </div>
              <span className={classes.pictureDescription}>{picture.description}</span>
            </ImageWrapper>
          );
        })}
      </div>)}
    </Fragment>
  )
};

export default Images;
