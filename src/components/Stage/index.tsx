import React, { FC, useEffect, useMemo, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import StagingItems from './components/staging-items';
import NavBar from '../Settings/components/nav-bar';
import { useDispatch, useSelector } from 'react-redux';
import { refresh, stageSelector } from '../../reducers/stage';
import { styles } from './style';

interface StageProps {
  classes: any,
}

export const Stage: FC<StageProps> = ({ classes }) => {
  const stage = useSelector(stageSelector);
  const dispatch = useDispatch();
  const [isStaging, setIsStaging] = useState<boolean>(true);
  const navItems = useMemo(() => {
    return [
      {
        value: `Backlog (${stage.backlog.length})`,
        current: !isStaging,
        onClick: () => setIsStaging(false),
        disabled: false,
      },
      {
        value: `Stage (${stage.current.length})`,
        current: isStaging,
        onClick: () => setIsStaging(true),
        disabled: false,
      },      
    ];
  }, [stage, isStaging]);

  useEffect(() => {
    dispatch(refresh());
  }, []);

  return (
    <div className={classes.root}>
      <NavBar
        items={navItems}
        id={'staging-nav'}
      />
      <StagingItems
        classes={classes}
        isStaging={isStaging}
        items={isStaging ? stage.current : stage.backlog}
      />
    </div>
  );
};

export default withStyles(styles)(Stage);
