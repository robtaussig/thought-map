import React, { FC } from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: any) => ({
  root: {
    height: '100%',
    margin: 50,
    textAlign: 'center',
    ...theme.defaults.centered,
    fontSize: 30,
    color: theme.palette.negative[100],
  },
}));

interface MissingThoughtProps {

}

export const MissingThought: FC<MissingThoughtProps> = () => {
  const classes = useStyles({});

  return (
    <div className={classes.root}>
      Uh oh, this thought does not exist (yet)!
    </div>
  );
};

export default MissingThought;
