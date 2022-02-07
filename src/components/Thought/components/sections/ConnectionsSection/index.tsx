import React, { FC } from 'react';
import ThoughtSection from '../ThoughtSection';
import Link from '@material-ui/icons/Link';
import useModal from '../../../../../hooks/useModal';
import { useNavigate } from 'react-router-dom';
import { ConnectionSummary } from '../../../';
import ConnectionsModal from './components/ConnectionsModal';
import { SectionState } from '../../../types';
import { thoughtSelector } from '../../../../../reducers/thoughts';
import { useTypedSelector } from '../../../../../reducers';

interface ConnectionsSectionProps {
  classes: any;
  onCreate: (value: string) => void;
  connections: ConnectionSummary[];
  thoughtId: string;
  sectionState: SectionState;
  onToggleVisibility: () => void;
  sectionOrder: string[];
  visible: boolean;
}

export const ConnectionsSection: FC<ConnectionsSectionProps> = ({
  classes,
  sectionOrder,
  onCreate,
  thoughtId,
  connections,
  sectionState,
  onToggleVisibility,
  visible = true,
}) => {
  const [openModal, closeModal] = useModal();
  const thoughts = useTypedSelector(thoughtSelector.selectAll);
  const thoughtTitles = thoughts.map(({ title }) => title);
  const navigate = useNavigate();
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
    navigate(`/${planId ? `plan/${planId}/` : ''}thought/${id}`);
  };

  const toConnections = connections.filter(({ isParent }) => Boolean(isParent));

  return (
    <ThoughtSection
      classes={classes}
      sectionOrder={sectionOrder}
      section={'connections'}
      Icon={Link}
      field={`Connections (${toConnections.filter(connection => connection.otherThought.status === 'completed').length}/${toConnections.length})`}
      value={
        connections
          .sort((left) => left.isParent ? 1 : -1)
          .map(({ isParent, otherThought }, idx) => {
            const isCompleted = otherThought.status === 'completed';
            return (<span key={`${idx}-connection`} className={isCompleted ? 'completed' : 'incomplete'}>{isParent ? 'to' : 'from'}: {otherThought.title}</span>);
          })
      }
      className={'connections'}
      visible={visible}
      sectionState={sectionState}
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
