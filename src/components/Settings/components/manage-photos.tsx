import React, { FC, useState, Fragment, useCallback, useRef, useMemo } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import Check from '@material-ui/icons/Check';
import CircleButton from '../../../components/General/CircleButton';
import classNames from 'classnames';
import { openConfirmation } from '../../../lib/util';
import { Pictures } from '../../../reducers';
import { Picture } from '../../../store/rxdb/schemas/picture';
import { pictures as pictureActions } from '../../../actions';
import { useLoadedDB } from '../../../hooks/useDB';
import { useLoadingOverlay } from '../../../hooks/useLoadingOverlay';

interface ManagePhotosProps {
  classes: any,
  pictures: Pictures,
}

enum Side {
  LEFT = 'left',
  MIDDLE = 'middle',
}

const styles = (theme: any): StyleRules => ({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'red',
    transition: 'all 0.2s ease-out',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '&.hidden': {
      '& #submit': {
        display: 'none',
      }
    }
  },
  button: {
    border: '2px solid white',
    padding: '3px 0',
    marginTop: 40,
    width: '70%',
    borderRadius: '3px',
    backgroundColor: theme.palette.gray[500],
    color: 'white',
    '&:active': {
      backgroundColor: theme.palette.gray[700],
    }
  },
  circleButton: {
    ...theme.defaults.circleButton,
    '&#submit': {
      right: 10,
      bottom: 10,
    },
  },
});

const IMGUR_CLIENT_ID = 'f1b9f4565330211';

export const ManagePhotos: FC<ManagePhotosProps> = ({ classes, pictures }) => {
  const [side, setSide] = useState<Side>(Side.LEFT);

  const rootRef = useRef(null);
  const [setLoading, stopLoading] = useLoadingOverlay(rootRef);
  const db = useLoadedDB();
  const handleClickCheck = useCallback(() => {
    setSide(Side.LEFT);
  }, []);

  const kbUsed = useMemo(() => {
    return Object.values(pictures).map(picture => picture.localUrl).reduce((num, url) => {
      if (url) {
        num += 3 + ((url.length*16)/(8*1024));
      }
      return num;
    }, 0);
  }, [pictures]);

  const spaceUsedText = useMemo(() => {
    return `${(kbUsed / 1000).toFixed(2)}MB`;
  }, [kbUsed]);

  const handleClickUploadLocalImages = useCallback(() => {
    const uploadImage = async (image: Picture): Promise<Picture> => {
      const res = await fetch('https://api.imgur.com/3/image', {
        headers: {
            'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
              image: image.localUrl.replace(/^data.*base64/,''),
          }),
      })
      const rjson = await res.json();
      const newImage = {
        ...image,
        imgurUrl: rjson.data.link,
      }
      delete newImage.localUrl;
      return pictureActions.editPicture(db, newImage);
    };

    const onConfirm = async () => {
      setLoading('Uploading images...')
      await Promise.all(
        Object.values(pictures)
          .filter(picture => picture.localUrl)
          .map(uploadImage)
        );
      stopLoading();
    };

    openConfirmation('Are you sure you want to upload all of your pictures to imgur?', onConfirm);
  }, [pictures]);

  console.log(spaceUsedText);

  return (
    <Fragment>
      <button className={classes.button} onClick={() => setSide(Side.MIDDLE)}>
        Manage Photos
      </button>
      <div ref={rootRef} className={classNames(classes.container, {
        visible: side === Side.MIDDLE,
        hidden: side === Side.LEFT
      })} style={{
        left: side === Side.LEFT ? '100%' : 0,
      }}>
        <button className={classes.button} onClick={handleClickUploadLocalImages}>Upload all local images to imgur ({spaceUsedText})</button>
        <CircleButton classes={classes} id={'submit'} onClick={handleClickCheck} label={'Submit'} Icon={Check}/>
      </div>
    </Fragment>
  );
};

export default withStyles(styles)(ManagePhotos);
