import './full-screen-image.scss';
import { FC, useEffect } from 'react';

interface FullScreenImageProps {
  onClose: () => void;
  image: string;
}

export const FullScreenImage: FC<FullScreenImageProps> = ({ onClose, image }) => {
  useEffect(() => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('imageWrapper');

    const closeButton = document.createElement('button');
    closeButton.innerText = '×';
    closeButton.classList.add('closeButton');
    closeButton.onclick = onClose;

    const imageElement = document.createElement('img');
    imageElement.src = image;
    imageElement.classList.add('image');
    imageElement.id = 'full-screen-image';
    imageElement.onclick = e => {
      imageElement.classList.toggle('zoom');
      if (imageElement.classList.contains('zoom')) {
        closeButton.style.display = 'none';
      } else {
        closeButton.style.display = 'block';
      }
    };

    wrapper.appendChild(closeButton);
    wrapper.appendChild(imageElement);
    document.body.appendChild(wrapper);

    return () => {
      document.body.removeChild(wrapper);
    };
  }, []);

  return null;
};

export default FullScreenImage;
