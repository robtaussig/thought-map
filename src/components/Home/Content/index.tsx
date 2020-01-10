import './style.scss';
import React, { useRef, FC, Fragment, useState, useMemo, useEffect, memo } from 'react';
import { Plan } from '~store/rxdb/schemas/plan';
import { Thought } from '~store/rxdb/schemas/thought';
import { Graph } from './lib/graph';
import { ThoughtConnections } from './types';
import { useLoadedDB } from '../../../hooks/useDB';
import useModal from '../../../hooks/useModal';
import { useSelector, useDispatch } from 'react-redux';
import { settings as settingsActions } from '../../../actions';
import { thoughtSelector } from '../../../reducers/thoughts';
import { settingSelector } from '../../../reducers/settings';
import { connectionSelector } from '../../../reducers/connections';
import { emphasizeButton, ButtonPositions } from '../../../reducers/tutorial';
import { planSelector } from '../../../reducers/plans';
import { sortFilterSettingsSelector } from '../../../reducers/sortFilterSettings';
import { searcherWorker } from '../../../store/init';
import FilterAndSearch from './FilterAndSearch';
import ThoughtNodes from './ThoughtNodes';
import PriorityTutorial from '../../Tutorials/PriorityTutorial';
import LongPressTutorial from '../../Tutorials/LongPressTutorial';
import BlankThoughtNode from './BlankThoughtNode';

interface ContentProps {
  classes: any;
  thoughts: Thought[];
  plan: Plan;
  statusOptions: string[];
  typeOptions: string[];
  from: string;
}

export const Content: FC<ContentProps> = ({ classes, thoughts, plan, statusOptions, typeOptions, from }) => {
  const dispatch = useDispatch();
  const thoughtMap = useRef<Graph>(new Graph());
  const didMount = useRef<boolean>(false);
  const db = useLoadedDB();
  const [openModal] = useModal();
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [matchingThoughts, setMatchingThoughts] = useState<string[]>(null);
  const stateThoughts = useSelector(thoughtSelector);
  const stateConnections = useSelector(connectionSelector);
  const plans = useSelector(planSelector);
  const settings = useSelector(settingSelector);
  const sortFilterSettings = useSelector(sortFilterSettingsSelector);

  const connectionStatusByThought = useMemo(() => {
    thoughtMap.current
      .updateThoughts(stateThoughts)
      .updateConnections(Object.values(stateConnections));

    return Object.values(stateConnections).reduce((next, { from, to }) => {
      if (thoughts.find(({ id }) => from === id) && thoughts.find(({ id }) => to === id)) {
        next[from] = next[from] || [0,0];
        const otherThought = thoughts.find(otherThought => otherThought.id === to);
        next[from][1]++;
        if (otherThought.status === 'completed') next[from][0]++;
      }
      return next;
    }, {} as ThoughtConnections);
  }, [stateConnections, thoughts, stateThoughts]);

  useEffect(() => {
    const runSearch = async () => {
      const matches = await searcherWorker.findMatches(searchTerm);
      
      setMatchingThoughts(matches);
    }
    
    if (searchTerm?.length > 2) {
      runSearch();
    } else if (searchTerm?.length === 0) {
      setMatchingThoughts(null);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timeout = setTimeout(() => didMount.current = true, 1000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (thoughts.length === 0) {
      dispatch(emphasizeButton(ButtonPositions.Right));

      return () => dispatch(emphasizeButton(null));
    }
  }, [thoughts.length]);

  useEffect(() => {
    if (didMount.current === false && settings.disableTips !== true) {

      if (
        thoughts.length > 0 &&
        settings.learnedLongPress !== true
      ) {
        dispatch(emphasizeButton(ButtonPositions.LeftAlt));
        openModal(<LongPressTutorial/>, 'About Long Press', {
          afterClose: () => {
            settingsActions.createSetting(db, {
              field: 'learnedLongPress',
              value: true,
            });
          }
        });
      } else if (
        thoughts.length > 3 &&
        settings.learnedPriorityList !== true
      ) {
        dispatch(emphasizeButton(ButtonPositions.MiddleAlt));
        openModal(<PriorityTutorial/>, 'About Priority', {
          afterClose: () => {
            settingsActions.createSetting(db, {
              field: 'learnedPriorityList',
              value: true,
            });
          }
        });
      }
    }
  },[thoughts, settings]);

  return (
    <Fragment>
      <FilterAndSearch
        classes={classes}
        setShowFilters={setShowFilters}
        showFilters={showFilters}
        searchTerm={searchTerm}
        sortFilterSettings={sortFilterSettings}
        setSearchTerm={setSearchTerm}
      />
      {thoughts.length === 0 ? (
        <div className={classes.content}>
          {new Array(10).fill(null).map((_, idx) => {
            return (
                <BlankThoughtNode
                  key={`${idx}-blank-thought`}
                />
              );
            })
          }
        </div>
      ) : (
        <ThoughtNodes
          classes={classes}
          thoughts={thoughts}
          matchingThoughts={matchingThoughts}
          plan={plan}
          thoughtMap={thoughtMap}
          sortFilterSettings={sortFilterSettings}
          plans={plans}
          didMount={didMount}
          setShowFilters={setShowFilters}
          statusOptions={statusOptions}
          typeOptions={typeOptions}
          from={from}
          connectionStatusByThought={connectionStatusByThought}
        />
      )}
    </Fragment>
  );
};

export default memo(Content);
