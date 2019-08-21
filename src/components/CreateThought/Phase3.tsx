import React, { useCallback, useMemo, FC, Dispatch, ChangeEventHandler } from 'react';
import Header from '../General/Header';
import PhaseNext from './PhaseNext';
import Select from '../General/Select';
import Notes from '@material-ui/icons/Notes';
import Add from '@material-ui/icons/Add';
import Close from '@material-ui/icons/Close';
import { useNestedXReducer, Action } from '../../hooks/useXReducer';
import { CreatedThought } from './';

interface Phase3Props {
  classes: any,
  onBack: () => void,
  isFocus: boolean,
  createdThought: CreatedThought,
  dispatch: Dispatch<Action>,
}

export const Phase3: FC<Phase3Props> = React.memo(({
  classes,
  onBack,
  isFocus,
  createdThought,
  dispatch,
}) => {
  const [tags, setTags] = useNestedXReducer('tags', createdThought, dispatch);
  const [tagOptions, setTagOptions] = useNestedXReducer('tagOptions', createdThought, dispatch);
  const isReady = validateInputs();
  const handleDeleteTag = (idx: number) => () => setTags(tags.filter((_, prevIdx) => prevIdx !== idx));
  const filteredTagOptions = useMemo(() => tagOptions.filter(tag => tags.indexOf(tag) === -1), [tags, tagOptions]);
  const handleAddTag = useCallback(() => setTags(prev => prev.concat(filteredTagOptions.length === 1 ? filteredTagOptions[0] : '')), [filteredTagOptions]);
  const handleCreateTag = (idx: number): ChangeEventHandler<HTMLSelectElement> => e => {
    const nextValue = e.target.value;
    setTags(tags.map((value, prevIdx) => prevIdx === idx ? nextValue : value));
  };

  return (
    <div className={`${classes.phase} ${classes.phase3} ${isFocus ? ' isFocus' : ''}`}>
      {isFocus && <Header classes={classes} value={'Tags'} />}
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

const validateInputs = (): boolean => {
  return true;
};
