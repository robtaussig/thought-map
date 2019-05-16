import React from 'react';
import useApp from '../../hooks/useApp';
import Add from '@material-ui/icons/Add';

export const AddButton = React.memo(({ classes }) => {
  const { history, dispatch } = useApp();

  return (
    <button className={classes.addButton}>
      <Add/>
    </button>
  );
});

export default AddButton;
