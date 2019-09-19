import React, { FC, Fragment, useCallback, useState } from 'react';
import { Picture } from 'store/rxdb/schemas/picture';
import ImageWrapper from './ImageWrapper';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import FullScreenImage from './FullScreenImage';
import EditPictureDescription from './EditPictureDescription';
import useModal from '../../../../../hooks/useModal';

interface ImagesProps {
  classes: any;
  relatedPictures: Picture[];
  loaded: boolean;
  deleteImage: (id: string) => () => Promise<any>;
}

export const Images: FC<ImagesProps> = ({ classes, relatedPictures, loaded, deleteImage }) => {
  const [fullScreenImage, setFullScreenImage] = useState<Picture>(null);
  const [openModal, closeModal] = useModal();
  const handleClickImage = (idx: number) => () => {
    const picture = relatedPictures[idx];
    setFullScreenImage(picture);
  };

  const handleCloseFullScreenImage = useCallback(() => {
    setFullScreenImage(null);
  }, []);

  const handleClickEditDescription = (picture: Picture) => () => {
    openModal(<EditPictureDescription onClose={closeModal} picture={picture}/>);
  };

  return (
    <Fragment>
      {relatedPictures.length > 0 && (<div className={classes.imageList}>
        {relatedPictures.map((picture, idx) => {
          return (
            <ImageWrapper key={`${picture.id}`} className={classes.pictureItem} loaded={loaded}>
              {/* 
              // @ts-ignore */}
              <img src={picture.localUrl || picture.imgurUrl} className={classes.image} loading="lazy" onClick={handleClickImage(idx)}/>
              <div className={classes.uploadOptions}>
                <button className={classes.deleteButton} onClick={deleteImage(picture.id)}><Delete/></button>
              </div>
              {picture.description ?
                (
                  <div className={classes.pictureDescription}>
                    <span className={classes.pictureDescriptionText}>{picture.description}</span>
                    <button
                      className={classes.editPictureDescriptionButton}
                       onClick={handleClickEditDescription(picture)}
                    >
                      <Edit/>
                    </button>
                  </div>
                ) :
                (<button className={classes.pictureDescriptionButton} onClick={handleClickEditDescription(picture)}>Write Description</button>)            
              }
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
