import React, { FC } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { Group } from '../types';
import Part from './part';

interface ThoughtGroupProps {
  classes: any;
  group: Group;
}

const styles = (theme: any): StyleRules => ({
  statusUpdate: {
    position: 'relative',
    '&:before': {
      content: "''",
      backgroundColor: theme.palette.gray[500],
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 'calc(50% - 2px)',
      right: 'calc(50% - 2px)',
    },
    '&.isSelected': {
      '&:before': {
        backgroundColor: theme.palette.secondary[600],
        opacity: 0.6,
      },
    },
    '&.isStart': {
      '&:before': {
        top: '50%',
      },
    },
    '&.isEnd': {
      '&:before': {
        bottom: '50%',
      },
    },
    '&:not(.path)': {
      borderRadius: '50%',
      '&:after': {
        content: "''",
        backgroundColor: theme.palette.secondary[300],
        borderRadius: '50%',
        position: 'absolute',
        height: 12,
        width: 12,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      },
      '&.new': {
        '&:after': {
          backgroundColor: theme.palette.secondary[100],
        },
      },
      '&.completed': {
        '&:after': {
          backgroundColor: theme.palette.primary[500],
        },
      },
    },
    
    '&.path': {

    },
  },
  partText: {
    zIndex: 99,
    color: theme.palette.gray[100],
    textShadow: '0px 0px 4px black',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&.isSelected': {
      color: theme.palette.secondary[400],
      fontWeight: 600,
    },
  },
});

export const ThoughtGroup: FC<ThoughtGroupProps> = React.memo(({ classes, group }) => {
  const parts = group[0].statusUpdateIndex[1] + 1;
  const thoughtIndex = group[0].thoughtIndex[0];
  const thoughtCount = group[0].thoughtIndex[1] + 1;
  const isSelected = Boolean(group[0].isSelectedThought);

  return (
    <>
      {new Array(parts).fill(null).map((chunk, index) => {
        const part = group.find(({ statusUpdateIndex }) => {
          return statusUpdateIndex[0] === index;
        });

        if (part) {
          return (
            <Part
              key={`${thoughtIndex}-${index}-group-part`}
              classes={classes}
              part={part}
              row={index + 1}
              col={thoughtIndex + 1}
              colCount={thoughtCount}
              groupIndex={[group.indexOf(part), group.length - 1]}
              isSelected={isSelected}
            />
          );
        } else if (index > group[0].statusUpdateIndex[0] &&
          index < group[group.length - 1].statusUpdateIndex[0]) {
            return (
              <Part
                key={`${thoughtIndex}-${index}-group-part`}
                classes={classes}
                part={null}
                row={index + 1}
                col={thoughtIndex + 1}
                colCount={thoughtCount}
                isSelected={isSelected}
              />
            );
        }
      })}      
    </>
  );
});

export default withStyles(styles)(ThoughtGroup);
