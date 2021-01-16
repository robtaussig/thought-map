import React, { FC, useEffect, useState, useMemo } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import useApp from '../../hooks/useApp';
import { useLoadedDB } from '../../hooks/useDB';
import useModal from '../../hooks/useModal';
import useCrypto from '../../hooks/useCrypto';
import CreateThought from '../CreateThought';
import CreateBulkThought from '../CreateThought/Bulk';
import CircleButton from '../General/CircleButton';
import History from '@material-ui/icons/History';
import Link from '@material-ui/icons/Link';
import Add from '@material-ui/icons/Add';
import Refresh from '@material-ui/icons/Refresh';
import Check from '@material-ui/icons/Check';
import ArrowBack from '@material-ui/icons/ArrowBack';
import CloudUpload from '@material-ui/icons/CloudUpload';
import Delete from '@material-ui/icons/Delete';
import { getIdFromUrl, homeUrl, openConfirmation, getSearchParam } from '../../lib/util';
import { useSelector, useDispatch } from 'react-redux';
import { displayThoughtSettingsSelector, toggle } from '../../reducers/displayThoughtSettings';
import { emphasizeButton, tutorialSelector, ButtonPositions } from '../../reducers/tutorial';
import { settingSelector } from '../../reducers/settings';
import { backupSelector } from '../../reducers/backups';
import { mergeResultsSelector } from '../../reducers/mergeResults';
import { thoughts as thoughtActions, backups as backupActions } from '../../actions';
import { jsonDump } from '../Settings/components/Data';
import { CHUNK_LENGTH } from '../Settings/components/SetupBackup/constants';
import { chunkData } from '../Settings/components/SetupBackup/util';
import { updateChunk, getVersion } from '../Settings/components/SetupBackup/api';
import { getBackupIdFromHistory } from '../Merge/util';

interface RightButtonProps {
  classes: any;
  typeOptions: string[];
}

const styles = (theme: any): StyleRules => ({
  circleButton: () => ({
    ...theme.defaults.circleButton,
    border: `2px solid ${theme.palette.primary[500]}`,
    backgroundColor: 'black',
    bottom: 0,
    right: 0,
    zIndex: 999,
    '&#has-secondary': {
      border: `2px solid ${theme.palette.secondary[500]}`,
    },
    '&#delete-button': {
      border: `2px solid ${theme.palette.negative[300]}`,
      backgroundColor: theme.palette.negative[300],
    },
    '&#updating-button': {
      animation: 'rotate 1s infinite',
      border: `2px solid gray`,
      backgroundColor: 'gray',
    },
    '&#updated': {
      border: `2px solid limegreen`,
      backgroundColor: 'limegreen',
    },
    '&#merge': {
      '&:disabled': {
        border: `2px solid #ccc`,
        backgroundColor: '#ccc',
      },
    },
  }),
});

export const RightButton: FC<RightButtonProps> = ({ classes, typeOptions }) => {
  const [openModal, closeModal] = useModal();
  const dispatch = useDispatch();
  const [hideButton, setHideButton] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [updated, setUpdated] = useState<boolean>(false);
  const { history } = useApp();
  const { db } = useLoadedDB();
  const { encrypt } = useCrypto();
  const displayThoughtSettings = useSelector(displayThoughtSettingsSelector);
  const tutorial = useSelector(tutorialSelector);
  const settings = useSelector(settingSelector);
  const backups = useSelector(backupSelector);
  const { comparables } = useSelector(mergeResultsSelector);

  useEffect(() => {
    setHideButton(/(stage|settings|backups|process-merge|privacy)/.test(history.location.pathname));

    return () => dispatch(toggle(false));
  }, [history.location.pathname])

  const [
    Icon,
    label,
    handleClick,
    id,
    handleLongPress,
    LongPressIcon,
  ]: [any, string, () => void, string, () => void, any?] = useMemo(() => {

    const handleAddThought = () => {
      openModal(
        <CreateThought
          onClose={closeModal}
          onCreateBulk={() => {
            closeModal();
            openModal(
              <CreateBulkThought
                onClose={closeModal}
              />, 'Create Bulk Thoughts'
            );
          }}
          typeOptions={typeOptions}
        />, 'Create Thought'
      );
    }

    const handleClickViewConnections = () => {
      const thoughtId = getIdFromUrl(history, 'thought');
      history.push(`${homeUrl(history)}thought/${thoughtId}/connections`);
    };

    const handleClickViewHistory = () => {
      const thoughtId = getIdFromUrl(history, 'thought');
      history.push(`${homeUrl(history)}thought/${thoughtId}/history`);
    };

    const handleBack = () => {
      history.goBack();
    };

    const handleDeleteThought = () => {
      const thoughtId = getIdFromUrl(history, 'thought');
      if (typeof thoughtId === 'string') {
        const onConfirm = async () => {
          await thoughtActions.deleteThought(db, thoughtId);
          history.push(homeUrl(history));
        };

        openConfirmation('Are you sure you want to delete this?', onConfirm);
      }
    };

    const handleDemandBackup = async () => {
      setUpdating(true);
      let activeBackup;
      try {
        activeBackup = backups.find(backup => backup.isActive);

        if (activeBackup) {
          const { password, privateKey, backupId, version } = activeBackup;
          const currentVersion = await getVersion(backupId);
          const nextVersion = Number(currentVersion?.version ?? version) + 1;
          const data = await jsonDump(db);
          const NUM_CHUNKS = Math.ceil(data.length / CHUNK_LENGTH);
          const chunks = chunkData(data, NUM_CHUNKS);
          await backupActions.editBackup(db, {
            ...activeBackup,
            version: nextVersion,
            merged: false,
          });
          const encryptedChunks = await Promise.all(chunks.map(chunk => encrypt(chunk, privateKey)));
          await Promise.all(encryptedChunks.map((chunk, idx) => updateChunk(chunk, idx, backupId, password, nextVersion, encryptedChunks.length)));
          
          setUpdated(true);
          setTimeout(() => {
            setUpdated(false);
          }, 2000);
        } else {
          throw new Error('No active backup');
        }
      } catch (e) {
        backupActions.editBackup(db, {
          ...activeBackup,
          version: activeBackup.version,
          merged: false,
        });
        alert(e);
      } finally {
        setUpdating(false);
      }
    };

    const handleClickMerge = () => {
      const backupId = getBackupIdFromHistory(history);
      const version = getSearchParam(history, 'v');
      history.push(`/process-merge/${backupId}?v=${version}`);
    };

    if (updated) return [Check, 'Updated', null, 'updated', null];
    if (updating) return [Refresh, 'Updating', null, 'updating-button', null];

    if (/(history|connections|timeline)$/.test(history.location.pathname)) {
      return [ArrowBack, 'Back', handleBack, 'thought-button', null];
    } else if (/thought/.test(history.location.pathname)) {
      if (displayThoughtSettings) {
        return [Delete, 'Delete Thought', handleDeleteThought, 'delete-button', null];
      } else {
        return [Link, 'History', handleClickViewConnections, 'has-secondary', handleClickViewHistory, History];
      }
    } else if (/merge/.test(history.location.pathname)) {
      if (comparables.length === 0) {
        return [Check, 'Merge', handleClickMerge, 'merge', null, null];
      } else {
        return [Check, 'Merge', null, 'merge', null, null];
      }
    } else {
      return settings.enableBackupOnDemand ?
        [Add, 'Create Thought', handleAddThought, 'thought-button', handleDemandBackup, CloudUpload] :
        [Add, 'Create Thought', handleAddThought, 'thought-button', null, null];
    }
  }, [history.location.pathname, displayThoughtSettings, settings.enableBackupOnDemand, updating, updated, comparables, backups]);

  if (hideButton) return null;

  const isEmphasized = tutorial.emphasizeButton === ButtonPositions.Right;
  const isAltEmphasized = tutorial.emphasizeButton === ButtonPositions.RightAlt;

  return (
    <CircleButton
      onClick={handleClick ? () => {
        if (!isAltEmphasized) {
          isEmphasized && dispatch(emphasizeButton(null));
          handleClick();
        }
      } : undefined}
      id={id}
      disabled={handleClick === null}
      classes={classes}
      label={label}
      Icon={Icon}
      onLongPress={handleLongPress ? () => {
        if (!isEmphasized) {
          isAltEmphasized && dispatch(emphasizeButton(null));
          handleLongPress();
        }
      } : undefined}
      LongPressIcon={LongPressIcon}
      emphasize={isEmphasized || isAltEmphasized}
    />
  );
};

export default withStyles(styles)(RightButton);
