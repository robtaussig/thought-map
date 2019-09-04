import React, { Fragment, FC } from 'react';
import ImageWrapper from './ImageWrapper';

interface TempImagesProps {
  classes: any,
  tempImages: any[],
  loaded: boolean,
  uploadImageLocally: (idx: number) => () => Promise<any>,
  uploadImageToImgur: (idx: number) => () => Promise<any>,
}

export const TempImages: FC<TempImagesProps> = ({ classes, tempImages, uploadImageLocally, uploadImageToImgur, loaded }) => {

  return (
    <Fragment>
      {tempImages.length > 0 && (<div className={classes.imageList}>
        {tempImages.map((objectUrl, idx) => {
          return (
            <ImageWrapper key={`${idx}-temp-image`} className={classes.imageItem} loaded={loaded}>
              {/* 
              // @ts-ignore */}
              <img src={objectUrl} className={classes.image} loading="lazy"/>
              <div className={classes.uploadOptions}>
                <button onClick={uploadImageLocally(idx)}>Local</button>
                <button onClick={uploadImageToImgur(idx)}>Imgur</button>
              </div>
            </ImageWrapper>
          );
        })}
      </div>)}
    </Fragment>
  );
};

export default TempImages;
