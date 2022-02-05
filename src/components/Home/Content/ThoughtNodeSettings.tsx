import React, { FC, useMemo, useRef } from 'react';
import { StyleRules, withStyles } from '@material-ui/styles';
import { Thought } from '../../../store/rxdb/schemas/thought';
import classNames from 'classnames';
import { useLoadedDB } from '../../../hooks/useDB';
import { useNavigate } from 'react-router-dom';
import Tooltip from '../../General/Tooltip';
import { thoughts as thoughtActions } from '../../../actions';
import { openConfirmation, useHomeUrl } from '../../../lib/util';
import { useSelector } from 'react-redux';
import { connectionSelector } from '../../../reducers/connections';
import { format } from 'date-fns';
import useThoughtMap from '../../../hooks/useThoughtMap';
import { useLoadingOverlay } from '../../../hooks/useLoadingOverlay';

interface ThoughtNodeSettingsProps {
  classes: any,
  thought: Thought;
  onClose: () => void;
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    userSelect: 'none',
  },
  title: {
    marginBottom: 20,
    fontWeight: 600,
    fontSize: 20,
  },
  buttonWrapper: () => ({
    border: `1px solid ${theme.palette.secondary[700]}`,
    margin: '10px 0',
    width: '70%',
    borderRadius: '5px',
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    '& .tooltip': {
      position: 'absolute',
      justifyContent: 'center',
      right: -30,
      '& > svg': {
        color: theme.palette.secondary[700],
      },
    },
  }),
  button: () => ({
    width: '100%',
    padding: '5px 15px',
    color: theme.palette.secondary[700],
    fontWeight: 600,
    transition: 'all 0.3s linear',
    '&.delete': {
      color: theme.palette.negative[500],
    },
    '&:active': {
      color: theme.palette.background[200],
      backgroundColor: theme.palette.secondary[700],
      '&.delete': {
        color: theme.palette.background[200],
        backgroundColor: theme.palette.negative[500],
      },
    },
  }),
});

const BUMP_TOOLTIP_TEXT = 'Bumping a thought will update it so that it will be displayed at the top (when sorted by last updated), without changing any other fields. This can be useful to increase the visibility of a thought that becomes buried over time as new thoughts rise to the top.';
const STAGE_TOOLTIP_TEXT = 'Staging a thought flags it as being relevant on the day it is staged. All staged thoughts are collected and displayed on the \'Stage\', which can be viewed by clicking on the bookmark button. Thoughts that were staged on a previous day are placed in the \'Backlog\'. Thoughts are unstaged as soon as they are completed.';

export const ThoughtNodeSettings: FC<ThoughtNodeSettingsProps> = ({ classes, thought, onClose }) => {
  const { db } = useLoadedDB();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>();
  const homeUrl = useHomeUrl();
  const connections = useSelector(connectionSelector);
  const thoughtMap = useThoughtMap(thought.id);
  const [setLoading, stopLoading, updateText] = useLoadingOverlay(rootRef);

  const handleClickBump = () => {
    onClose();
    thoughtActions.editThought(db, {
      ...thought
    });
  };

  const handleClickArchive = () => {
    onClose();
    thoughtActions.editThought(db, {
      ...thought,
      archived: !thought.archived,
    });
  };

  const handleClickDelete = (withChildren: boolean) => () => {
    if (withChildren) {
      const deleteThoughtsOneByOne = async (thoughtIds: string[]) => {
        const failed: [string, Error][] = [];
        setLoading('Deleting thoughts: 0%');
        for (const thoughtId of thoughtIds) {
          updateText(`Deleting ${thoughtId} - ${thoughtIds.indexOf(thoughtId) + 1} of ${thoughtIds.length}`);
          try {
            await thoughtActions.deleteThought(db, thoughtId);
          } catch (e) {
            failed.push([thoughtId, e]);
          }
        }

        stopLoading();

        return failed;
      };

      openConfirmation('Are you sure you want to delete this thought and all child thoughts?', async () => {
        const errored = await deleteThoughtsOneByOne(thoughtMap.descendants);
        if (errored.length === 0) {
          onClose();
        } else {
          alert(`The following errors occured while deleting ${errored.length} thoughts: ${errored.map(([_, error]) => error.message).join(', ')}`);
        }
      });
    } else {
      openConfirmation('Are you sure you want to delete this thought?', () => {
        thoughtActions.deleteThought(db, thought.id);
        onClose();
      });
    }
  };

  const handleClickViewConnections = () => {
    onClose();
    navigate(`${homeUrl}thought/${thought.id}/connections`);
  };

  const handleClickViewHistory = () => {
    onClose();
    navigate(`${homeUrl}thought/${thought.id}/history`);
  };

  const handleClickStage = () => {
    onClose();
    const today = format(new Date(), 'yyyy-MM-dd');
    thoughtActions.editThought(db, {
      ...thought,
      stagedOn: today,
    });
  };

  const hasConnections = useMemo(() => {
    return Object.values(connections).some(({ from, to }) => [from, to].includes(thought.id));
  }, [connections, thought]);

  return (
    <div className={classes.root} ref={rootRef}>
      <h1 className={classes.title}>{thought.title}</h1>
      <div className={classes.buttonWrapper}>
        <button className={classes.button} onClick={handleClickBump}>Bump</button>
        <Tooltip className={'tooltip'} text={BUMP_TOOLTIP_TEXT} />
      </div>
      <div className={classes.buttonWrapper}>
        {thought.archived ? (
          <button className={classes.button} onClick={handleClickArchive}>Unarchive</button>
        ) : (
          <button className={classes.button} onClick={handleClickArchive}>Archive</button>
        )}
      </div>
      <div className={classes.buttonWrapper}>
        <button className={classes.button} onClick={handleClickStage}>Stage</button>
        <Tooltip className={'tooltip'} text={STAGE_TOOLTIP_TEXT} />
      </div>
      <div className={classes.buttonWrapper}>
        <button className={classes.button} onClick={handleClickViewHistory}>View History</button>
      </div>
      {hasConnections && <div className={classes.buttonWrapper}>
        <button className={classes.button} onClick={handleClickViewConnections}>View Connections</button>
      </div>}
      <div className={classes.buttonWrapper}>
        <button className={classNames(classes.button, 'delete')} onClick={handleClickDelete(false)}>Delete</button>
      </div>
      {thoughtMap.descendants.length > 1 && (<div className={classes.buttonWrapper}>
        <button className={classNames(classes.button, 'delete')} onClick={handleClickDelete(true)}>Delete With Children</button>
      </div>)}
    </div>
  );
};

export default withStyles(styles)(ThoughtNodeSettings);
