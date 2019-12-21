import './style.scss';
import React, { useRef, FC, Fragment, useState, useMemo, useEffect } from 'react';
import { Plan } from '~store/rxdb/schemas/plan';
import { Thought } from '~store/rxdb/schemas/thought';
import { Graph } from './lib/graph';
import { ThoughtConnections } from './types';
import { useSelector } from 'react-redux';
import { thoughtSelector } from '../../../reducers/thoughts';
import { connectionSelector } from '../../../reducers/connections';
import { planSelector } from '../../../reducers/plans';
import { sortFilterSettingsSelector } from '../../../reducers/sortFilterSettings';
import { searcherWorker } from '../../../store/init';
import FilterAndSearch from './FilterAndSearch';
import ThoughtNodes from './ThoughtNodes';
import BlankThoughtNode from './BlankThoughtNode';

interface ContentProps {
  classes: any;
  thoughts: Thought[];
  plan: Plan;
  statusOptions: string[];
  typeOptions: string[];
  from: string;
}

export const Content: FC<ContentProps> = React.memo(({ classes, thoughts, plan, statusOptions, typeOptions, from }) => {
  const thoughtMap = useRef<Graph>(new Graph());
  const didMount = useRef<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [matchingThoughts, setMatchingThoughts] = useState<string[]>(null);
  const stateThoughts = useSelector(thoughtSelector);
  const stateConnections = useSelector(connectionSelector);
  const plans = useSelector(planSelector);
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
});

export default Content;
