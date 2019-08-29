import React, { FC, Fragment } from 'react';
import { Picture } from 'store/rxdb/schemas/picture';

interface ImagesProps {
  classes: any,
  relatedPictures: Picture[],
}

export const Images: FC<ImagesProps> = ({ classes, relatedPictures }) => {

  return (
    <Fragment>
      {relatedPictures.length > 0 && (<div className={classes.imageList}>
        {relatedPictures.map((picture, idx) => {
          return (
            <div key={`${idx}-thought-picture`} className={classes.pictureItem}>
              <img src={picture.localUrl || picture.imgurUrl} className={classes.image}/>
              <span className={classes.pictureDescription}>{picture.description}</span>
            </div>
          );
        })}
      </div>)}
    </Fragment>
  )
};

export default Images;
