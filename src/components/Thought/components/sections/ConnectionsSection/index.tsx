import React, { FC } from 'react';
import ThoughtSection from '../ThoughtSection';
import Link from '@material-ui/icons/Link';
import useModal from '../../../../../hooks/useModal';
import useApp from '../../../../../hooks/useApp';
import { ConnectionSummary } from '../../../';
import ConnectionsModal from './components/ConnectionsModal';
import { SectionState } from '../../../types';

interface ConnectionsSectionProps {
  classes: any;
  onCreate: (value: string) => void;
  connections: ConnectionSummary[];
  thoughtId: string;
  sectionState: SectionState;
  onLongPress: (e: any) => void;
  onDrop: () => void;
  onToggleVisibility: () => void;
}

export const ConnectionsSection: FC<ConnectionsSectionProps> = ({
  classes,
  onCreate,
  thoughtId,
  connections,
  sectionState,
  onLongPress,
  onDrop,
  onToggleVisibility,
}) => {
  const [openModal, closeModal] = useModal();
  const { history } = useApp();
  const handleEdit = () => {
    openModal(
      <ConnectionsModal
        onClose={closeModal}
        thoughtId={thoughtId}
      />
    );
  };

  const handleClickItem = (item: string, idx: number) => {
    const { id, planId } = connections[idx].otherThought;
    history.push(`/${planId ? `plan/${planId}/` : ''}thought/${id}`);
  };

  return (
    <ThoughtSection
      classes={classes}
      Icon={Link}
      field={`Connections (${connections.filter(connection => connection.otherThought.status === 'completed').length}/${connections.length})`}
      value={connections.map(({ isParent, otherThought }) => {
        return `${isParent ? 'to' : 'from'}: ${otherThought.title}${otherThought.status === 'completed' ? ' ✓' : ''}`;
      })}
      className={'connections'}
      visible={true}
      sectionState={sectionState}
      onLongPress={onLongPress}
      onDrop={onDrop}
      onToggleVisibility={onToggleVisibility}
      edit={{
        type: null,
        onEdit: handleEdit,
        onCreate: onCreate,
        onChangeVisibility: console.log,
        onClickItem: handleClickItem,
      }}
    />
  );
};

export default ConnectionsSection;
