import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CREATE_NEW_PLAN } from '../';
import { plans as planActions, thoughts as thoughtActions } from '../../../../actions';
import CircleButton from '../../../General/CircleButton';
import useApp from '../../../../hooks/useApp';
import { useLoadedDB } from '../../../../hooks/useDB';
import Input from '../../../General/Input';
import CheckBox from '../../../General/CheckBox';
import Cancel from '@material-ui/icons/Cancel';
import Check from '@material-ui/icons/Check';
import IncludeThoughts from './IncludeThoughts';
import { styles, DEFAULT_STATE } from './style';

export const CreatePlanComponent = ({ classes, open, onClose, thoughts, plans }) => {
  const { history } = useApp();
  const db = useLoadedDB();
  const [planName, setPlanName] = useState('');
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [withThoughts, setWithThoughts] = useState(false);
  const [selectedThoughts, setSelectedThoughts] = useState([]);
  const [style, setStyle] = useState({});
  const rootRef = useRef(null);
  const focusInput = useRef(() => {});
  const planNames = useMemo(() => new Set(Object.values(plans).map(({ name}) => name)), [plans]);

  const handleChange = useCallback(event => setPlanName(event.target.value), []);
  const focusTitleInput = useCallback(focus => focusInput.current = focus, []);
  const toggleWithThoughts = useCallback(event => setWithThoughts(event.target.checked),[]);
  const handleSelectThought = useCallback(thought => setSelectedThoughts(prev => prev.concat(thought)));
  const handleRemoveThought = useCallback(thought => setSelectedThoughts(prev => prev.filter(prevThought => prevThought !== thought)));

  const resetState = () => {
    setPlanName('');
    setWithThoughts(false);
    setSelectedThoughts([]);
    setStyle(DEFAULT_STATE);
  };

  const handleSubmit = useCallback(() => {
    const createPlan = async () => {
      const plan = await planActions.createPlan(db, {
        name: planName,
      });
      return plan;
    };

    const attachThoughts = async planId => {
      const updateThought = async thoughtId => {
        const thought = thoughts.find(foundThought => foundThought.id === thoughtId);
        const nextThought = Object.assign({}, thought, {
          planId,
        });

        return thoughtActions.editThought(db, nextThought);
      };

      return Promise.all(selectedThoughts.map(updateThought));
    };

    const createObjectsAndGoBack = async () => {
      const plan = await createPlan();
      await attachThoughts(plan.id);
      history.push(`/plan/${plan.id}/`);
      onClose(plan.name);
    };

    createObjectsAndGoBack();
  }, [selectedThoughts, planName, withThoughts, history]);

  useEffect(() => {
    const { x, y, height } = rootRef.current.getBoundingClientRect();
    const distanceToBottom = window.innerHeight - y - height;

    if (open) {
      setStyle({
        top: -y,
        left: -x,
        right: -x,
        bottom: -distanceToBottom,
        borderRadius: 0,
        justifyContent: 'flex-start',
        visibility: 'visible',
      });

      const timeout = setTimeout(focusInput.current, 400);

      const unlisten = history.listen((event, type) => type === 'POP' && onClose());

      return () => {
        clearTimeout(timeout);
        unlisten();
      }
    } else {
      resetState();
    }
  }, [open]);

  useEffect(() => {
    if (planNames.has(planName)) {
      setAlreadyExists(true);
    } else {
      setAlreadyExists(false);
    }
  }, [planName]);

  return (
    <div ref={rootRef} className={`${classes.root}${withThoughts ? ' with-thoughts' : ''}`} style={style}>
      <h2 className={classes.header}>{CREATE_NEW_PLAN}</h2>
      {open && !withThoughts &&
        <Input
          classes={classes}
          value={planName}
          onChange={handleChange}
          id={'plan-name'}
          onFocus={focusTitleInput}
          injectedComponent={(<CheckBox
            id={'with-thoughts'}
            classes={classes}
            isChecked={withThoughts}
            value={'With thoughts'}
            onChange={toggleWithThoughts}
            label={'With thoughts'}
          />)}
        />
      }
      {open && withThoughts &&
        <IncludeThoughts
          classes={classes}
          thoughts={thoughts}
          selected={selectedThoughts}
          onSelect={handleSelectThought}
          onRemove={handleRemoveThought}
          onCancel={_ => setWithThoughts(false)}
        />
      }
      {alreadyExists &&
        <span className={classes.errorText}>A plan already exists by this name</span>
      }
      <CircleButton
        classes={classes}
        id={'cancel'}
        onClick={onClose}
        label={'Cancel'}
        Icon={Cancel}
      />
      <CircleButton
        classes={classes}
        id={'submit'}
        onClick={handleSubmit}
        label={'Submit'}
        Icon={Check}
        disabled={planName === '' || alreadyExists}
      />
    </div>
  );
};



export default withStyles(styles)(CreatePlanComponent);