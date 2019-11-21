import React, { FC } from 'react';
import ThoughtSection from '../ThoughtSection';
import Link from '@material-ui/icons/Link';
import useModal from '../../../../../hooks/useModal';
import useApp from '../../../../../hooks/useApp';
import { ConnectionSummary } from '../../../';
import ConnectionsModal from './components/ConnectionsModal';
import { SectionState } from '../../../types';
import { useSelector } from 'react-redux';
import { thoughtSelector } from '../../../../../reducers/thoughts';

interface ConnectionsSectionProps {
  classes: any;
  onCreate: (value: string) => void;
  connections: ConnectionSummary[];
  thoughtId: string;
  sectionState: SectionState;
  onLongPress: (e: any) => void;
  onDrop: () => void;
  onToggleVisibility: () => void;
  visible: boolean;
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
  visible = true,
}) => {
  const [openModal, closeModal] = useModal();
  const thoughts = useSelector(thoughtSelector);
  const thoughtTitles = thoughts.map(({ title }) => title);
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

  const toConnections = connections.filter(({ isParent }) => Boolean(isParent));

  return (
    <ThoughtSection
      classes={classes}
      Icon={Link}
      field={`Connections (${toConnections.filter(connection => connection.otherThought.status === 'completed').length}/${toConnections.length})`}
      value={
        connections
          .sort((left, right) => left.isParent ? 1 : -1)
          .map(({ isParent, otherThought }) => {
            const isCompleted = otherThought.status === 'completed';
            return (<span className={isCompleted ? 'completed' : 'incomplete'}>{isParent ? 'to' : 'from'}: {otherThought.title}</span>);
          })
      }
      className={'connections'}
      visible={visible}
      sectionState={sectionState}
      onLongPress={onLongPress}
      onDrop={onDrop}
      onToggleVisibility={onToggleVisibility}
      edit={{
        type: null,
        onEdit: handleEdit,
        onCreate: onCreate,
        onClickItem: handleClickItem,
        autoSuggest: thoughtTitles,
      }}
    />
  );
};

export default ConnectionsSection;
