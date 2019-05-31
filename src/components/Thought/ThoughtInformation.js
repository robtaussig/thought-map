import React, { useCallback } from 'react';
import Note from '@material-ui/icons/Note';
import AccessTime from '@material-ui/icons/AccessTime';
import CalendarToday from '@material-ui/icons/CalendarToday';
import Header from '../General/Header';
import Select from '../General/Select';

export const ThoughtInformation = React.memo(({ classes, thought, tags = [], notes = [], statusOptions = [], onStatusChange }) => {

  const handleStatusChange = useCallback(event => onStatusChange(event.target.value), []);

  return (
    <div className={classes.thoughtInformation}>
      <Header classes={classes} value={thought.title}/>
      {thought.time ? (
        <span className={classes.thoughtTime}>{thought.time}</span>
      ) : (
        <button className={`${classes.thoughtTime} icon-button`}><AccessTime className={classes.timeIcon}/></button>
      )}
      {thought.date ? (
        <span className={classes.thoughtDate}>{thought.date}</span>
      ) : (
        <button className={`${classes.thoughtDate} icon-button`}><CalendarToday className={classes.dateIcon}/></button>
      )}
      <Select
        id={'status'}
        classes={classes}
        value={thought.status}
        options={statusOptions}
        onChange={handleStatusChange}
      />
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
