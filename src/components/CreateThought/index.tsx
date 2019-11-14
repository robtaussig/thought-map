import React, { useState, useEffect, useCallback, MouseEvent, FC, FormEventHandler, Fragment } from 'react';
import useApp from '../../hooks/useApp';
import { ExpandModal, CloseModal } from '../../hooks/useModal/types';
import { useLoadedDB } from '../../hooks/useDB';
import useXReducer, { useNestedXReducer } from '../../hooks/useXReducer';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './style';
import Inputs from './Inputs';
import { createWholeThought } from '../../actions/complex';
import { homeUrl, getIdFromUrl } from '../../lib/util';
import { Note } from '../../store/rxdb/schemas/note';
import { Tag } from '../../store/rxdb/schemas/tag';
import { Template } from '../../store/rxdb/schemas/template';
import { AppState } from '../../reducers';
import classNames from 'classnames';
import { useModalDynamicState } from '../../hooks/useModal';

export interface CreatedThought {
  title: string;
  type: string;
  date: string;
  time: string;
  description: string;
  notes: string[];
  tags: string[];
  tagOptions: string[];
}

const DEFAULT_STATE: CreatedThought = {
  title: '',
  type: 'Task',
  date: '',
  time: '',
  description: '',
  notes: [],
  tags: [],
  tagOptions: [],
};

interface CreateThoughtProps {
  classes: any;
  typeOptions: string[];
  tagOptions: string[];
  onClose: CloseModal;
}

export const CreateThought: FC<CreateThoughtProps> = ({ classes, typeOptions, tagOptions, onClose }) => {
  const { history } = useApp();
  const state: AppState = useModalDynamicState();
  const [ready, setReady] = useState<boolean>(false);
  const db = useLoadedDB();
  const planId = getIdFromUrl(history, 'plan');
  const thoughtTitles = state.thoughts.map(({ title }) => title);
  const [ createdThought, createdThoughtDispatch ] = useXReducer(DEFAULT_STATE, (state, action) => {
    if (action.type === 'CREATE_FROM_TEMPLATE') return action.payload;
    return state;
  });

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (ready) {
      const response = await createWholeThought(db, createdThought, planId);
      onClose();
      history.push(`${homeUrl(history)}thought/${response.thought.id}`);
    }
  };
  
  return (
    <Fragment>
      <form className={classNames(classes.form)} onSubmit={handleSubmit}>
        <Inputs
          classes={classes}
          createdThought={createdThought}
          dispatch={createdThoughtDispatch}
          typeOptions={typeOptions}
          tagOptions={tagOptions}
          onReady={setReady}
          thoughtTitles={thoughtTitles}
        />
        <button className={classes.submitButton} disabled={!ready}>
          Submit
        </button>
      </form>      
    </Fragment>
  );
};

export default withStyles(styles)(CreateThought);
