import React, { useState, useCallback, useReducer } from 'react';
import useApp from '../../hooks/useApp';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import Phase1 from './Phase1';
import Phase2 from './Phase2';
import Phase3 from './Phase3';
import Phase4 from './Phase4';
import AddButton from '../Home/AddButton';
import Check from '@material-ui/icons/Check';
import { createdThoughtReducer, DEFAULT_STATE } from './reducer';

export const CreateThought = ({ classes, state }) => {
  const { history, dispatch } = useApp();
  const [ createdThought, createdThoughDispatch ] = useReducer(createdThoughtReducer, DEFAULT_STATE);
  const [ phase, setPhase ] = useState(1);
  const [ ready, setReady ] = useState(false);

  const handleSubmit = () => {

  };

  return (
    <div className={classes.root}>
      <Phase1
        classes={classes}
        onNext={() => setPhase(2)}
        isFocus={phase === 1}
        onReady={isReady => setReady(isReady)}
        onFocus={() => setPhase(1)}
        createdThought={createdThought}
        dispatch={createdThoughDispatch}
      />
      {phase > 1 && (
        <Phase2
          classes={classes}
          onNext={() => setPhase(3)}
          isFocus={phase === 2}
          onReady={isReady => setReady(isReady)}
          onFocus={() => setPhase(2)}
          createdThought={createdThought}
          dispatch={createdThoughDispatch}
        />
      )}
      {phase > 2 && <Phase3 classes={classes} onNext={() => setPhase(4)} isFocus={phase === 3} createdThought={createdThought} dispatch={createdThoughDispatch}/>}
      {phase > 3 && <Phase4 classes={classes} onNext={handleSubmit} isFocus={phase === 4} createdThought={createdThought} dispatch={createdThoughDispatch}/>}
      <AddButton classes={classes} onClick={handleSubmit} label={'Create Thought'} disabled={!ready} Icon={Check}/>
    </div>
  );
};

export default withStyles(styles)(CreateThought);
