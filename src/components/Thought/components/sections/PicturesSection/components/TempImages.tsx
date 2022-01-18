import React, { Fragment, FC, useState, useCallback } from 'react';
import ImageWrapper from './ImageWrapper';
import FullScreenImage from './FullScreenImage';

interface TempImagesProps {
  classes: any;
  tempImages: any[];
  loaded: boolean;
  uploadImageLocally: (idx: number) => () => Promise<any>;
  uploadImageToImgur: (idx: number) => () => Promise<any>;
}

export const TempImages: FC<TempImagesProps> = ({ classes, tempImages, uploadImageLocally, uploadImageToImgur, loaded }) => {
    const [fullScreenImage, setFullScreenImage] = useState<string>(null);
    const handleClickImage = (idx: number) => () => {
        const picture = tempImages[idx];
        setFullScreenImage(picture);
    };

    const handleCloseFullScreenImage = useCallback(() => {
        setFullScreenImage(null);
    }, []);

    return (
        <Fragment>
            {tempImages.length > 0 && (<div className={classes.imageList}>
                {tempImages.map((objectUrl, idx) => {
                    return (
                        <ImageWrapper key={`${idx}-temp-image`} className={classes.imageItem} loaded={loaded}>
                            {/* 
              // @ts-ignore */}
                            <img src={objectUrl} className={classes.image} loading="lazy" onClick={handleClickImage(idx)}/>
                            <div className={classes.uploadOptions}>
                                <button onClick={uploadImageLocally(idx)}>Local</button>
                                <button onClick={uploadImageToImgur(idx)}>Imgur</button>
                            </div>
                        </ImageWrapper>
                    );
                })}
            </div>)}
            {fullScreenImage && (
                <FullScreenImage onClose={handleCloseFullScreenImage} image={fullScreenImage}/>
            )}
        </Fragment>
    );
};

export default TempImages;
