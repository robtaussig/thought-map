import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircleButton from '../General/CircleButton';
import Delete from '@material-ui/icons/Delete';
import useModal from '../../hooks/useModal';

const TITLE_HEIGHT = 52;

const styles = theme => ({
  root: {
    position: 'fixed',
    height: `calc(100vh - ${TITLE_HEIGHT}px)`,
    left: 0,
    right: 0,
    backgroundColor: '#545454f0',    
    transition: 'all 0.3s linear',
  },
  settings: {
    height: '100%',
    width: '100%',
    position: 'relative',
    display: 'grid',
    gridTemplateAreas: `"template template"
                        "color color"
                        "background background"
                        "fields fields"
                        "recurring recurring"`,
    gridTemplateRows: 'repeat(5, max-content)',
    gridTemplateColums: 'max-content 1fr',
    gridGap: '20px',
    '& > button:not(#delete-thought)': {
      width: 200,
      margin: 20,
      padding: '10px 20px',
      borderRadius: 5,
      backgroundColor: theme.palette.primary[500],
    },
  },
  templateButton: {
    gridArea: 'template',
  },
  color: {
    gridArea: 'color',
  },
  background: {
    gridArea: 'background',
  },
  fields: {
    gridArea: 'fields',
  },
  recurring: {
    gridArea: 'recurring',
  },
  circleButton: {
    ...theme.defaults.circleButton,
    '&#delete-thought': {
      bottom: 10,
      right: 10,
      border: `2px solid ${theme.palette.red[300]}`,
      backgroundColor: theme.palette.red[300],
    },
  },
});

export const ThoughtSettings = ({ classes, display, thought, onDelete }) => {
  const [openModal, closeModal] = useModal();

  const handleClickUseAsTemplate = () => {
    openModal(<div>Hello!!!!!!</div>, 'Test');
  };

  const handleClickCustomColor = () => {
    openModal(<div>Custom Color</div>, 'Pick a custom color');
  };

  const handleClickCustomBackground = () => {
    openModal(<div>Custom Background</div>, 'Pick a custom background');
  };

  const handleClickHideFields = () => {
    openModal(<div>Hide Fields</div>, 'Control Field Visibility');
  };

  return (
    <div className={classes.root} style={{
        top: display ? TITLE_HEIGHT : '100%',
        visibility: display ? 'visible' : 'hidden',
      }}>
      <div className={classes.settings}>
        <button className={classes.templateButton} onClick={handleClickUseAsTemplate}>Create Template</button>
        <button className={classes.color} onClick={handleClickCustomColor}>Custom Color</button>
        <button className={classes.background} onClick={handleClickCustomBackground}>Custom Background</button>
        <button className={classes.fields} onClick={handleClickHideFields}>Hide Fields</button>
        <div className={classes.recurring}>Recurring</div>
        <CircleButton classes={classes} id={'delete-thought'} onClick={onDelete} label={'Delete Thought'} Icon={Delete}/>
      </div>
    </div>
  );
};

export default withStyles(styles)(ThoughtSettings);
