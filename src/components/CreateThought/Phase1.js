import React, { useState } from 'react';
import PhaseHeader from './PhaseHeader';
import PhaseInput from './PhaseInput';
import PhaseSelect from './PhaseSelect';

export const Phase1 = React.memo(({ classes, onNext, isFocus }) => {
  const [title, setTitle] = useState('');
  const [typeOptions, setTypeOptions] = useState(['Task', 'Todo', 'Reminder', 'Misc']);
  const [type, setType] = useState(typeOptions[0]);

  return (
    <div className={`${classes.phase} ${classes.phase1} ${isFocus ? ' isFocus' : ''}`}>
      <PhaseHeader classes={classes} value={'Thought'}/>
      <PhaseInput id={'title'} classes={classes} value={title} onChange={e => setTitle(e.target.value)} label={'Title'}/>
      <PhaseSelect id={'type'} classes={classes} value={type} options={typeOptions} onChange={e => setType(e.target.value)} label={'Type'}/>
    </div>
  );
});

export default Phase1;
