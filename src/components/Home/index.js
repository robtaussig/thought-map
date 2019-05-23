import React, { useCallback } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Content from './Content/index';
import GuideButton from './GuideButton';
import SettingsButton from './SettingsButton';
import Header from './Header';
import AddButton from './AddButton';
import { styles } from './styles';
import useApp from '../../hooks/useApp';


export const Home = ({ classes, state }) => {
  const { history, dispatch } = useApp();

  const handleAddThought = useCallback(() => history.push('/thought/new'), []);

  return (
    <div className={classes.root}>
      <Content classes={classes} thoughts={state.thoughts} connections={state.connections}/>
      <GuideButton classes={classes}/>
      <SettingsButton classes={classes}/>
      <Header classes={classes}/>
      <AddButton classes={classes} onClick={handleAddThought} label={'Add Thought'}/>
    </div>
  );
};

export default withStyles(styles)(Home);
