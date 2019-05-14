import React, { useEffect, useState, useCallback } from 'react';
import { withStyles } from '@material-ui/core';
import { styles } from './App.style';
import { getThoughts, createThought, deleteThought, editThought } from './actions';

const App = ({ classes }) => {
  const [thoughts, setThoughts] = useState([]);

  useEffect(() => {
    getThoughts()
      .then(setThoughts);
  }, []);

  const handleClickButton = useCallback(async () => {
    const thoughtObject = { text: 'Hellooooo' };
  
    const result = await createThought(thoughtObject);
    setThoughts(prev => prev.concat(result));
  }, []);

  const handleDelete = useCallback(async ({ id }) => {
    await deleteThought(id);
    setThoughts(prev => prev.filter(prevThought => prevThought.id !== id ));
  }, []);

  const handleEdit = useCallback(async thought => {
    const next = Object.assign({}, thought, {
      text: thought.text + '!',
    });
  
    await editThought(next);
    setThoughts(prev => prev.map(prevThought => prevThought.id === thought.id ? next : prevThought ));
  }, []);

  return (
    <div className={classes.root}>
      <button onClick={handleClickButton}>
        Add thought
      </button>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {thoughts.map((thought, idx) => {
          return (
            <div key={`${idx}-thought`}>
              <span onClick={() => handleDelete(thought)}>{thought.text}</span>
              <button onClick={() => handleEdit(thought)}>Edit</button>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default withStyles(styles)(App);
