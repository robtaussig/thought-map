import React, { FC } from 'react';
import ThoughtSection from '../ThoughtSection';
import Link from '@material-ui/icons/Link';
import useModal from '../../../../../hooks/useModal';
import useApp from '../../../../../hooks/useApp';
import { ConnectionSummary } from '../../../';
import ConnectionsModal from './components/ConnectionsModal';

interface ConnectionsSectionProps {
  classes: any;
  onCreate: (value: string) => void;
  connections: ConnectionSummary[];
  thoughtId: string;
}

export const ConnectionsSection: FC<ConnectionsSectionProps> = ({ classes, onCreate, thoughtId, connections }) => {
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
