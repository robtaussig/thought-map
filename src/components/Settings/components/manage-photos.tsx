import React, { FC, useState, Fragment, useCallback, useRef, useMemo } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import Close from '@material-ui/icons/Close';
import CircleButton from '../../../components/General/CircleButton';
import classNames from 'classnames';
import { openConfirmation } from '../../../lib/util';
import { Pictures } from '../../../reducers';
import { Picture } from '../../../store/rxdb/schemas/picture';
import { pictures as pictureActions } from '../../../actions';
import { useLoadedDB } from '../../../hooks/useDB';
import { useLoadingOverlay } from '../../../hooks/useLoadingOverlay';

interface ManagePhotosProps {
  classes: any;
  pictures: Pictures;
}

enum Side {
  TOP = 'left',
  MIDDLE = 'middle',
}

const styles = (theme: any): StyleRules => ({
  container: {
    position: 'fixed',
    height: '100%',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#545454',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.2s ease-out',
    zIndex: 100,
    '&.hidden': {
      '& #submit': {
        display: 'none',
      }
    }
  },
  header: {
    flex: '0 0 80px',
    backgroundColor: theme.palette.primary[500],
    boxShadow: '0px 0px 5px 0px black',
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    fontSize: 24,
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
      boxShadow: 'none!important',
    },
    '&:disabled': {
      backgroundColor: theme.palette.gray[300],
      color: 'white',
    },
    '&:not(:disabled)': {
      boxShadow: '0px 0px 5px 2px black',
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
  const [side, setSide] = useState<Side>(Side.TOP);

  const rootRef = useRef(null);
  const [setLoading, stopLoading] = useLoadingOverlay(rootRef);
  const db = useLoadedDB();
  const handleClickClose = useCallback(() => {
    setSide(Side.TOP);
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

  const handleClickDownloadImages = useCallback(() => {
    alert('Coming soon...')
  }, [pictures]);

  const handleClickViewAllImages = useCallback(() => {
    alert('Coming soon...')
  }, [pictures]);
  
  return (
    <Fragment>
      <button className={classes.button} onClick={() => setSide(Side.MIDDLE)}>
        Manage Photos
      </button>
      <div ref={rootRef} className={classNames(classes.container, {
        visible: side === Side.MIDDLE,
        hidden: side === Side.TOP
      })} style={{
        top: side === Side.TOP ? '100%' : 0,
      }}>
        <h1 className={classes.header}>Manage Photos</h1>
        <button className={classes.button} disabled={kbUsed === 0} onClick={handleClickUploadLocalImages}>Upload all images to imgur ({spaceUsedText})</button>
        <button className={classes.button} onClick={handleClickDownloadImages}>Download all images to phone</button>
        <button className={classes.button} onClick={handleClickViewAllImages}>View all images</button>
        <CircleButton classes={classes} id={'submit'} onClick={handleClickClose} label={'Submit'} Icon={Close}/>
      </div>
    </Fragment>
  );
};

export default withStyles(styles)(ManagePhotos);
