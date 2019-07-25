import React, { useCallback, useMemo } from 'react';
import Header from '../General/Header';
import PhaseNext from './PhaseNext';
import Select from '../General/Select';
import Notes from '@material-ui/icons/Notes';
import Add from '@material-ui/icons/Add';
import Close from '@material-ui/icons/Close';
import { useNestedXReducer } from '../../hooks/useXReducer';

export const Phase3 = React.memo(({
  classes,
  onBack,
  isFocus,
  onFocus,
  createdThought,
  dispatch,
  thoughts,
}) => {
  const [tags, setTags] = useNestedXReducer('tags', createdThought, dispatch);
  const [tagOptions, setTagOptions] = useNestedXReducer('tagOptions', createdThought, dispatch);
  const isReady = validateInputs();
  const handleDeleteTag = idx => () => setTags(tags.filter((_, prevIdx) => prevIdx !== idx));
  const filteredTagOptions = useMemo(() => tagOptions.filter(tag => tags.indexOf(tag) === -1), [tags, tagOptions]);
  const handleAddTag = useCallback(() => setTags(prev => prev.concat(filteredTagOptions.length === 1 ? filteredTagOptions[0] : '')), [filteredTagOptions]);
  const handleCreateTag = idx => e => {
    const nextValue = e.target.value;
    setTags(tags.map((value, prevIdx) => prevIdx === idx ? nextValue : value));
  };

  return (
    <div className={`${classes.phase} ${classes.phase3} ${isFocus ? ' isFocus' : ''}`}>
      {isFocus && <Header classes={classes} value={'Tags'} onClick={onFocus}/>}
      <ul className={classes.tagGrid}>
        {tags.map((tag, idx) => {
          return <li key={`${idx}-tag`}>{tag === '' ? (
            <Select id={'tag'} classes={classes} value={''} options={filteredTagOptions} onChange={handleCreateTag(idx)} label={null}/>
          ): tag}{tag !== '' && <button className={classes.deleteTagButton} onClick={handleDeleteTag(idx)}><Close/></button>}</li>
        })}
        {filteredTagOptions.length > 0 && <button className={classes.addTagButton} onClick={handleAddTag}><Add/></button>}
      </ul>
      {isFocus && isReady && <PhaseNext classes={classes} onClick={onBack} label={'Add Notes'} id={'add-notes'} Icon={Notes}/>}
    </div>
  );
});

export default Phase3;

const validateInputs = () => {
  return true;
};
