import React, { useEffect, useCallback } from 'react';
import PhaseHeader from './PhaseHeader';
import PhaseNext from './PhaseNext';
import PhaseSelect from './PhaseSelect';
import Notes from '@material-ui/icons/Notes';
import Add from '@material-ui/icons/Add';
import Close from '@material-ui/icons/Close';
import { useNestedXReducer } from '../../hooks/useXReducer';

export const Phase3 = React.memo(({ classes, onBack, isFocus, onFocus, createdThought, dispatch }) => {
  const [tags, setTags] = useNestedXReducer('tags', createdThought, dispatch);
  const [tagOptions, setTagOptions] = useNestedXReducer('tagOptions', createdThought, dispatch);
  const isReady = validateInputs();
  const handleDeleteTag = idx => () => setTags(tags.filter((_, prevIdx) => prevIdx !== idx));
  const handleAddTag = useCallback(() => setTags(prev => prev.concat('')), []);
  const handleCreateTag = idx => e => {
    const nextValue = e.target.value;
    setTags(tags.map((value, prevIdx) => prevIdx === idx ? nextValue : value));
  };

  return (
    <div className={`${classes.phase} ${classes.phase3} ${isFocus ? ' isFocus' : ''}`}>
      {isFocus && <PhaseHeader classes={classes} value={'Tags'} onClick={onFocus}/>}
      <ul className={classes.tagGrid}>
        {tags.map((tag, idx) => {
          return <li key={`${idx}-tag`}>{tag === '' ? (
            <PhaseSelect id={'tag'} classes={classes} value={''} options={tagOptions} onChange={handleCreateTag(idx)} label={null}/>
          ): tag}{tag !== '' && <button className={classes.deleteTagButton} onClick={handleDeleteTag(idx)}><Close/></button>}</li>
        })}
        <button className={classes.addTagButton} onClick={handleAddTag}><Add/></button>
      </ul>
      {isFocus && isReady && <PhaseNext classes={classes} onClick={onBack} label={'Add Notes'} id={'add-notes'} Icon={Notes}/>}
    </div>
  );
});

export default Phase3;

const validateInputs = () => {
  return true;
};
