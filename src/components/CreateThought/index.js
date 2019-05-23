import React, { useState, useCallback } from 'react';
import useApp from '../../hooks/useApp'
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import Phase1 from './Phase1';
import Phase2 from './Phase2';
import Phase3 from './Phase3';
import Phase4 from './Phase4';
import AddButton from '../Home/AddButton';

export const CreateThought = ({ classes, state }) => {
  const { history, dispatch } = useApp();
  const [ phase, setPhase ] = useState(1);
  const [ ready, setReady ] = useState(false);

  const handleSubmit = () => {
    
  };

  return (
    <div className={classes.root}>
      <Phase1 classes={classes} onNext={() => setPhase(2)} isFocus={phase === 1} onReady={() => setReady(true)}/>
      {phase > 1 && <Phase2 classes={classes} onNext={() => setPhase(3)} isFocus={phase === 2}/>}
      {phase > 2 && <Phase3 classes={classes} onNext={() => setPhase(4)} isFocus={phase === 3}/>}
      {phase > 3 && <Phase4 classes={classes} onNext={handleSubmit} isFocus={phase === 4}/>}
      <AddButton classes={classes} onClick={handleSubmit} label={'Create Thought'} disabled={!ready}/>
    </div>
  );
};

export default withStyles(styles)(CreateThought);
