import React from 'react';
import Note from '@material-ui/icons/Note';

export const ThoughtInformation = React.memo(({ classes, thought, tags = [], notes = [] }) => {

  return (
    <div className={classes.thoughtInformation}>
      <h1 className={classes.thoughtTitle}>{thought.title}</h1>
      <span className={classes.thoughtTime}>{thought.time}</span>
      <span className={classes.thoughtStatus}>New</span>
      <span className={classes.thoughtDate}>{thought.date}</span>
      <span className={classes.thoughtType}>{thought.type}</span>
      {notes.length > 0 && <ul className={classes.noteList}>
        {notes.map(({ text }, idx) => {
          return (
            <li className={classes.noteItem} key={`${idx}-note`}><Note className={classes.noteIcon}/>{text}</li>
          );
        })}
      </ul>}
      {tags.length > 0 && <ul className={classes.tagList}>
        {tags.map(({ text }, idx) => {
          return (
            <li className={classes.tagItem} key={`${idx}-note`}>{text}</li>
          );
        })}
      </ul>}
      <span className={classes.thoughtDescription}>
        {thought.description}
      </span>
    </div>
  );
});

export default ThoughtInformation;
