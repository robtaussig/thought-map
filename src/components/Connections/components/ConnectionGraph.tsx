import React, { FC, useMemo, useEffect, useRef } from 'react';
import { withStyles, StyleRules, CSSProperties } from '@material-ui/styles';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { Connections } from '../../../reducers/connections';
import NodeComponent from './NodeComponent';
import Grapher, {
  ThoughtsById,
} from '../lib/grapher';
import useThoughtMap from '../../../hooks/useThoughtMap';

interface ConnectionGraphProps {
  classes: any;
  thought: Thought;
  thoughts: Thought[];
  connections: Connections;
  statusOptions: string[];
}

const styles = (theme: any): StyleRules => ({
  root: {
    height: '100%',
  },
  canvas: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  nodeComponent: {
    ...theme.defaults.centered,
    '&:after': {
      content: "''",
      border: '1px solid #000000db',
      backgroundColor: theme.palette.background[300],
      borderRadius: '50%',
      height: 15,
      width: 15,
    },
    '&.completed:not(.origin)': {
      '&:after': {
        backgroundColor: theme.palette.primary[500],
        height: 20,
        width: 20,
      },
    },
    '&.inProgress:not(.origin)': {
      '&:after': {
        backgroundColor: '#ffb811',
        height: 20,
        width: 20,
      },
    },
    '&.origin': {
      '&:after': {
        backgroundColor: theme.palette.secondary[300],
        height: 25,
        width: 25,
      },
    },
  },
  nodeTitle: {
    fontWeight: 600,
    color: theme.palette.background[200],
    textShadow: '0px 0px 30px black',
    overflow: 'auto',
    '&.origin': {
      color: theme.palette.secondary[300],
    },
  },
});

export const ConnectionGraph: FC<ConnectionGraphProps> = ({ classes, thought, thoughts, connections, statusOptions }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tree } = useThoughtMap(thought?.id);

  const thoughtsById = useMemo(() => {
    return thoughts.reduce((byId, thought) => {
      byId[thought.id] = thought;
      return byId;
    }, {} as ThoughtsById);
  }, [thoughts]);

  useEffect(() => {
    const grapher = new Grapher();
    grapher.draw(canvasRef.current, tree, thoughtsById);
  }, [tree, thoughtsById]);

  const [columns, rows, _nodes]: any[] = useMemo(() => {
    const maxY = Math.max(...tree.map(({ y }) => y));
    const maxX = Math.max(...tree.map(({ x }) => x));

    return [maxX, maxY, tree.map(({ x, y, vertex }) => {
      const nodeThought = thoughtsById[vertex.id];

      return (
        <NodeComponent
          classes={classes}
          key={nodeThought.id}
          x={x}
          y={y}
          columns={maxX}
          thought={nodeThought}
          isOrigin={thought.id === nodeThought.id}
          statusOptions={statusOptions}
        />
      )
    })];
  }, [tree, thoughtsById]);

  const style: CSSProperties = useMemo(() => {
    return {
      display: 'grid',
      gridTemplateRows: `repeat(${rows + 1}, ${100 / (rows + 1)}%)`,
      gridTemplateColumns: `repeat(${columns + 1}, ${100 / (columns + 1)}%)`,
    };
  }, [columns, rows]);

  return (
    <div className={classes.root} style={style}>      
      <canvas
        className={classes.canvas}
        ref={canvasRef}
        height={window.innerHeight}
        width={window.innerWidth}  
      />
      {_nodes}
    </div>
  );
};

export default withStyles(styles)(ConnectionGraph);
