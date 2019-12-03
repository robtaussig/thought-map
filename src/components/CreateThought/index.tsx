import React, { useState, FC, FormEventHandler, Fragment } from 'react';
import useApp from '../../hooks/useApp';
import { CloseModal } from '../../hooks/useModal/types';
import { useLoadedDB } from '../../hooks/useDB';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './style';
import Inputs from './Inputs';
import { createWholeThought } from '../../actions/complex';
import { homeUrl, getIdFromUrl } from '../../lib/util';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { thoughtSelector } from '../../reducers/thoughts';
import { settingSelector } from '../../reducers/settings';
import { Thought } from '../../store/rxdb/schemas/thought';
import { thoughts as thoughtActions } from '../../actions';
import { planSelector } from '../../reducers/plans';
import useGoogleCalendar, { GoogleCalendarEvent, Actions } from '../../hooks/useGoogleCalendar';
import {
  generateDescriptionFromThought,
  generateStartFromThought,
  generateEndFromThought,
  generateRemindersFromThought,
} from '../ThoughtSettings/components/Calendar/lib/util';

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
  onClose: CloseModal;
}

const DASH_REGEX = /-/g;

export const CreateThought: FC<CreateThoughtProps> = ({ classes, typeOptions, onClose }) => {
  const { history } = useApp();
  const thoughts = useSelector(thoughtSelector);
  const settings = useSelector(settingSelector);
  const plans = useSelector(planSelector);
  const [ready, setReady] = useState<boolean>(false);
  const db = useLoadedDB();
  const planId = getIdFromUrl(history, 'plan');
  const plan = plans.find(plan => plan.id === planId);
  const [createdThought, setCreatedThought] = useState<CreatedThought>({
    ...DEFAULT_STATE,
    type: plan ? plan.defaultType : DEFAULT_STATE.type
  });
  const thoughtTitles = thoughts.map(({ title }) => title);

  const [signedIn, actions, error]: [boolean, Actions, any] = settings.autoCreateCalendarEvent ? useGoogleCalendar() : [false, {
    createEvent: (event: any, calendarId: string) => {}
  }, null];

  const createCalendarEvent = async (thought: Thought) => {
    const gogleCalendarEvent: GoogleCalendarEvent = {
      kind: 'calendar#event',
      id: thought.id.replace(DASH_REGEX, ''),
      status: 'confirmed',
      summary: thought.title,
      description: generateDescriptionFromThought(thought),
      start: generateStartFromThought(thought),
      end: generateEndFromThought(thought),
      reminders: generateRemindersFromThought(thought),
    };

    const event = await actions.createEvent(gogleCalendarEvent);
    thoughtActions.editThought(db, {
      ...thought,
      calendarLink: event.result.htmlLink
    });
  };

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (ready) {
      const response = await createWholeThought(db, createdThought, planId);
      if (signedIn && response.thought.date) {
        createCalendarEvent(response.thought);
      }
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
          setCreatedThought={setCreatedThought}
          typeOptions={typeOptions}
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
