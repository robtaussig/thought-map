import React, { FC, useMemo, useState, useEffect, useRef } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { Connections } from '../../../reducers';
import Grapher, {
  GraphType,
  ThoughtsById,
} from '../lib/grapher';

interface ConnectionGraphProps {
  classes: any;
  thought: Thought;
  thoughts: Thought[];
  connections: Connections;
}


const styles = (theme: any): StyleRules => ({
  root: {

  },
  canvas: {

  },
});

export const ConnectionGraph: FC<ConnectionGraphProps> = ({ classes, thought, thoughts, connections }) => {
  const grapher = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [graph, setGraph] = useState<GraphType>({
    vertices: [],
    edges: [],
  });

  const getGrapher = (): Grapher => {
    if (grapher.current === null) {
      grapher.current = new Grapher();
    }

    return grapher.current;
  }

  const thoughtsById = useMemo(() => {
    return thoughts.reduce((byId, thought) => {
      byId[thought.id] = thought;
      return byId;
    }, {} as ThoughtsById);
  }, [thoughts]);

  useEffect(() => {
    getGrapher()
      .update(thought, thoughtsById, connections)
      .generate(setGraph);
  }, [thought, thoughtsById, connections]);

  useEffect(() => {
    Grapher.draw(canvasRef.current, graph);
  }, [graph]);

  return (
    <div className={classes.root}>
      <canvas className={classes.canvas} ref={canvasRef}/>
    </div>
  );
};

export default withStyles(styles)(ConnectionGraph);
