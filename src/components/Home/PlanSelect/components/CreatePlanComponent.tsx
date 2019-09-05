import React, { useEffect, useState, useRef, useCallback, useMemo, FC } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { CREATE_NEW_PLAN } from '../';
import { plans as planActions, thoughts as thoughtActions } from '../../../../actions';
import CircleButton from '../../../General/CircleButton';
import useApp from '../../../../hooks/useApp';
import { useLoadedDB } from '../../../../hooks/useDB';
import Input from '../../../General/Input';
import Cancel from '@material-ui/icons/Cancel';
import Check from '@material-ui/icons/Check';
import IncludeThoughts from './IncludeThoughts';
import { styles, DEFAULT_STATE } from './style';
import { Thought } from 'store/rxdb/schemas/thought';
import { Plan } from 'store/rxdb/schemas/plan';

const isMobile = window.innerWidth < 960;

interface CreatePlanComponentProps {
  classes: any,
  open: boolean,
  onClose: (param?: any) => void,
  thoughts: Thought[],
  plans: Plan[],
}

export const CreatePlanComponent: FC<CreatePlanComponentProps> = ({ classes, open, onClose, thoughts, plans }) => {
  const { history } = useApp();
  const db = useLoadedDB();
  const [planName, setPlanName] = useState<string>('');
  const [alreadyExists, setAlreadyExists] = useState<boolean>(false);
  const [withThoughts, setWithThoughts] = useState<boolean>(false);
  const [selectedThoughts, setSelectedThoughts] = useState<string[]>([]);
  const [style, setStyle] = useState<any>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const focusInput = useRef<() => void>(() => {});
  const planNames = useMemo(() => new Set(Object.values(plans).map(({ name}) => name)), [plans]);

  const handleChange = useCallback(event => setPlanName(event.target.value), []);
  const focusTitleInput = useCallback(focus => focusInput.current = focus, []);
  const toggleWithThoughts = useCallback(() => setWithThoughts(prev => !prev),[]);
  const handleSelectThought = useCallback(thought => setSelectedThoughts(prev => prev.concat(thought)), []);
  const handleRemoveThought = useCallback(thought => setSelectedThoughts(prev => prev.filter(prevThought => prevThought !== thought)), []);

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

    const attachThoughts = async (planId: string) => {
      const updateThought = async (thoughtId: string) => {
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
    const { x, y, height }: any = rootRef.current.getBoundingClientRect();    

    if (open) {
      if (isMobile) {
        const distanceToBottom = window.innerHeight - y - height;

        setStyle({
          top: -y,
          left: -x,
          right: -x,
          bottom: -distanceToBottom,
          borderRadius: 0,
          justifyContent: 'flex-start',
          visibility: 'visible',
        });
      } else {
        const root = document.querySelector('#app');
        const rootBoundaries: any = root.getBoundingClientRect();
        const distanceToBottom = rootBoundaries.y - (window.innerHeight - y - height);
  
        setStyle({
          top: (rootBoundaries.y - y),
          left: (rootBoundaries.x - x),
          right: (rootBoundaries.x - x),
          bottom: distanceToBottom,
          borderRadius: 0,
          justifyContent: 'flex-start',
          visibility: 'visible',
        });
      }

      const timeout = setTimeout(() => {
        focusInput.current && focusInput.current();
      }, 600);

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
          focusOnLabelClick={false}
          injectedComponent={(<button onClick={toggleWithThoughts}>Pick Thoughts</button>)}
        />
      }
      {open && withThoughts &&
        <IncludeThoughts
          classes={classes}
          thoughts={thoughts}
          selected={selectedThoughts}
          onSelect={handleSelectThought}
          onRemove={handleRemoveThought}
          onCancel={() => setWithThoughts(false)}
        />
      }
      {alreadyExists &&
        <span className={classes.errorText}>A plan already exists by this name</span>
      }
      {open &&
        <CircleButton
          classes={classes}
          id={'cancel'}
          onClick={onClose}
          label={'Cancel'}
          Icon={Cancel}
        />
      }
      {open &&
        <CircleButton
          classes={classes}
          id={'submit'}
          onClick={handleSubmit}
          label={'Submit'}
          Icon={Check}
          disabled={planName === '' || alreadyExists}
        />
      }
    </div>
  );
};

export default withStyles(styles)(CreatePlanComponent);