import React, { FC, useEffect, useState } from 'react';
import ThoughtSection from '../ThoughtSection';
import CameraAlt from '@material-ui/icons/CameraAlt';
import useModal from '../../../../../hooks/useModal';
import { Picture } from '../../../../../store/rxdb/schemas/picture';
import PicturesModal from './components/PicturesModal';
import { Thought } from '../../../../../store/rxdb/schemas/types';
import { pictures as pictureActions } from '../../../../../actions';
import { EditTypes, SectionState } from '../../../types';
import { useLoadedDB } from '../../../../../hooks/useDB';

interface PicturesSectionProps {
  classes: any;
  thought: Thought;
  pinnedPictures: Picture[];
  sectionState: SectionState;
  onToggleVisibility: () => void;
  sectionOrder: string[];
  visible: boolean;
}

export const PicturesSection: FC<PicturesSectionProps> = ({ classes, sectionOrder, thought, pinnedPictures, sectionState, onToggleVisibility, visible = true }) => {
  const [openModal, closeModal] = useModal();
  const { db } = useLoadedDB();
  const [retrievedPinnedPictures, setRetrievedPinnedPictures] = useState<Picture[]>([]);
  const handleEdit = () => {
    openModal(
      <PicturesModal
        onClose={closeModal}
        thought={thought}
      />
    );
  };

  const handleCreate = (value: string) => {
    console.log(value);
  };

  const handleClickItem = () => {
    console.log('hit');
  };

  useEffect(() => {
    const getLocalUrls = async (images: Picture[]) => {
      const result: Picture[] = [];
      for (const image of images) {
        if (image.imgurUrl) {
          result.push(image);
        } else {
          const withLocal = await pictureActions.getPicture(db, image.id);
          result.push(withLocal);
        }
      }

      setRetrievedPinnedPictures(result);
    };

    getLocalUrls(pinnedPictures);
  }, [pinnedPictures]);

  return (
    <ThoughtSection
      classes={classes}
      sectionOrder={sectionOrder}
      section={'pictures'}
      Icon={CameraAlt}
      field={'Pictures'}
      value={retrievedPinnedPictures.map(({ imgurUrl, localUrl, description }) => [(imgurUrl || localUrl), description])}
      className={'pictures'}
      visible={visible}
      sectionState={sectionState}
      onToggleVisibility={onToggleVisibility}
      edit={{
        type: EditTypes.Photo,
        onEdit: handleEdit,
        onCreate: handleCreate,
        onClickItem: handleClickItem,
        disableQuickAction: true,
      }}
    />
  );
};

export default PicturesSection;
