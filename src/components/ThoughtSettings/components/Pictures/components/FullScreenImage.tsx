import React, { FC, useEffect } from 'react';
import { withStyles, StyleRules } from '@material-ui/core/styles';

interface FullScreenImageProps {
  classes: any,
  onClose: () => void,
  image: string,
}

const styles = (theme: any): StyleRules => ({
  imageWrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'black',
    overflow: 'auto',
  },
  image: {
    width: '100%',
    height: 'auto',
    transition: 'all 0.3s linear',
    opacity: 0,
    '&.display': {
      opacity: 1,
    },
    '&.zoom': {
      width: '200%',
    },
  },
  closeButton: {
    color: 'white',
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    fontSize: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textShadow: '1px 1px 5px #000000',
  },
});

export const FullScreenImage: FC<FullScreenImageProps> = ({ classes, onClose, image }) => {

  useEffect(() => {
    const wrapper = document.createElement('div');
    wrapper.classList.add(classes.imageWrapper);
    const closeButton = document.createElement('button');
    closeButton.innerText = '×';
    closeButton.classList.add(classes.closeButton);
    closeButton.onclick = onClose;
    const imageElement = document.createElement('img');
    imageElement.src = image;
    imageElement.classList.add(classes.image);
    imageElement.onclick = ({ x, y, target }) => {
      imageElement.classList.toggle('zoom');
      if (imageElement.classList.contains('zoom')) {
        closeButton.style.display = 'none';
      } else {
        closeButton.style.display = 'block';
      }
    }
    wrapper.appendChild(closeButton);
    wrapper.appendChild(imageElement);
    document.body.appendChild(wrapper);
    setTimeout(() => {
      imageElement.classList.add('display');
    },50)
    return () => {
      document.body.removeChild(wrapper);
    }
  }, []);

  return null;
};

export default withStyles(styles)(FullScreenImage);
