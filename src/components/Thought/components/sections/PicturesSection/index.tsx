import React, { FC } from 'react';
import ThoughtSection from '../ThoughtSection';
import CameraAlt from '@material-ui/icons/CameraAlt';
import useModal from '../../../../../hooks/useModal';
import { Picture } from '../../../../../store/rxdb/schemas/picture';
import PicturesModal from './components/PicturesModal';
import { Thought } from '../../../../../store/rxdb/schemas/types';
import { EditTypes, SectionState } from '../../../types';

interface PicturesSectionProps {
  classes: any;
  thought: Thought;
  pinnedPictures: Picture[];
  sectionState: SectionState;
  onLongPress: (e: any) => void;
  onDrop: () => void;
  onToggleVisibility: () => void;
  visible: boolean;
}

export const PicturesSection: FC<PicturesSectionProps> = ({ classes, thought, pinnedPictures, sectionState, onLongPress, onDrop, onToggleVisibility, visible = true }) => {
  const [openModal, closeModal] = useModal();
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
  }

  return (
    <ThoughtSection
      classes={classes}
      Icon={CameraAlt}
      field={`Pictures`}
      value={pinnedPictures.map(({ imgurUrl, localUrl, description }) => [(imgurUrl || localUrl), description])}
      className={'pictures'}
      visible={visible}
      sectionState={sectionState}
      onLongPress={onLongPress}
      onDrop={onDrop}
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
