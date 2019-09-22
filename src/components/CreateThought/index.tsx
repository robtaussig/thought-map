import React, { useState, useEffect, useCallback, MouseEvent, FC, FormEventHandler, Fragment } from 'react';
import useApp from '../../hooks/useApp';
import { ExpandModal, CloseModal } from '../../hooks/useModal';
import { useLoadedDB } from '../../hooks/useDB';
import useXReducer, { useNestedXReducer } from '../../hooks/useXReducer';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
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
  onExpand: ExpandModal;
  onClose: CloseModal;
}

export const CreateThought: FC<CreateThoughtProps> = ({ classes, typeOptions, tagOptions, onExpand, onClose }) => {
  const { history } = useApp();
  const state: AppState = useModalDynamicState();
  const [ready, setReady] = useState<boolean>(false);
  const db = useLoadedDB();
  const planId = getIdFromUrl(history, 'plan');
  const plan = state.plans.find(plan => plan.id === planId);
  const [ createdThought, createdThoughtDispatch ] = useXReducer(DEFAULT_STATE, (state, action) => {
    if (action.type === 'CREATE_FROM_TEMPLATE') return action.payload;
    return state;
  });
  const [ type, setType ] = useNestedXReducer('type', createdThought, createdThoughtDispatch);

  const handleCreateFromTemplate = useCallback(({ template }: Template) => {
    const { thought, notes, tags } = template;

    const thoughtFromTemplate = {
      title: thought.title,
      typeOptions: typeOptions,
      type: thought.type,
      date: thought.date,
      time: thought.time,
      description: thought.description,
      notes: notes.map((note: Note) => note.text),
      tags: tags.map((tag: Tag) => tag.text),
      tagOptions: tagOptions,
    };

    createdThoughtDispatch({
      type: 'CREATE_FROM_TEMPLATE',
      payload: thoughtFromTemplate,
    });
  }, []);

  useEffect(() => {
    if (plan && plan.defaultType) setType(plan.defaultType);
  }, [plan]);

  const [expanded, setExpanded] = useState<boolean>(false);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (ready) {
      const response = await createWholeThought(db, createdThought, planId);
      onClose();
      history.push(`${homeUrl(history)}thought/${response.thought.id}`);
    }
  };

  const handleExpand = (e: MouseEvent) => {
    onExpand(true);
    setExpanded(true);
  };
  
  return (
    <Fragment>
      <form className={classNames(classes.form, {
        [classes.expanded]: expanded,
      })} onSubmit={handleSubmit}>
        <Inputs
          classes={classes}
          createdThought={createdThought}
          dispatch={createdThoughtDispatch}
          typeOptions={typeOptions}
          tagOptions={tagOptions}
          onReady={setReady}
          expanded={expanded}
        />
        <button className={classes.submitButton} disabled={!ready}>
          Submit
        </button>
      </form>
      {!expanded && (<button className={classes.moreButton} onClick={handleExpand}>
        More...
      </button>)}
    </Fragment>
  );
};

export default withStyles(styles)(CreateThought);
