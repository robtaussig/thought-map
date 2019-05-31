import React, { useCallback, useState } from 'react';
import Note from '@material-ui/icons/Note';
import AccessTime from '@material-ui/icons/AccessTime';
import CalendarToday from '@material-ui/icons/CalendarToday';
import Header from '../General/Header';
import Select from '../General/Select';
import Date from '../General/Date';

export const ThoughtInformation = React.memo(({ classes, thought, tags = [], notes = [], statusOptions = [], onUpdate }) => {
  const [edittingTime, setEdittingTime] = useState(false);
  const [edittingDate, setEdittingDate] = useState(false);
  const handleStatusChange = useCallback(event => {
    onUpdate({ ...thought, status: event.target.value });
  }, [thought]);
  const handleSetTime = useCallback(event => {
    setEdittingTime(false);
    onUpdate({ ...thought, time: event.target.value })
  }, [thought]);
  const handleSetDate = useCallback(event => {
    setEdittingDate(false);
    onUpdate({ ...thought, date: event.target.value })
  }, [thought]);

  return (
    <div className={classes.thoughtInformation}>
      <Header classes={classes} value={thought.title}/>
      {edittingTime ? (
        <Date
          id={'time'}
          classes={classes}
          value={''}
          onChange={handleSetTime}
          time
          autoFocus={true}
        />
      ) : thought.time ? (
        <span className={classes.thoughtTime}>{thought.time}</span>
      ) : (
        <button id={'time-button'} className={'icon-button'} onClick={_ => setEdittingTime(true)}><AccessTime className={classes.timeIcon}/></button>
      )}
      {edittingDate ? (
        <Date
          id={'date'}
          classes={classes}
          value={''}
          onChange={handleSetDate}
          autoFocus={true}
        />
      ) : thought.date ? (
        <span className={classes.thoughtDate}>{thought.date}</span>
      ) : (
        <button id={'date-button'} className={'icon-button'} onClick={_ => setEdittingDate(true)}><CalendarToday className={classes.dateIcon}/></button>
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
