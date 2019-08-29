import React, { Fragment, FC } from 'react';

interface TempImagesProps {
  classes: any,
  tempImages: any[],
  uploadImageLocally: (idx: number) => () => Promise<any>,
  uploadImageToImgur: (idx: number) => () => Promise<any>,
}

export const TempImages: FC<TempImagesProps> = ({ classes, tempImages, uploadImageLocally, uploadImageToImgur }) => {

  return (
    <Fragment>
      {tempImages.length > 0 && (<div className={classes.imageList}>
        {tempImages.map((objectUrl, idx) => {
          return (
            <div key={`${idx}-temp-image`} className={classes.imageItem}>
              <img src={objectUrl} className={classes.image}/>
              <div className={classes.uploadOptions}>
                <button onClick={uploadImageLocally(idx)}>Local</button>
                <button onClick={uploadImageToImgur(idx)}>Imgur</button>
              </div>
            </div>
          );
        })}
      </div>)}
    </Fragment>
  );
};

export default TempImages;
