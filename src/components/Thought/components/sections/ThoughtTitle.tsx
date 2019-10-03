import React, { FC, useState, useRef, MouseEventHandler, FormEventHandler, useEffect } from 'react';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Input from '../../../General/Input';
import { Thought } from '../../../../store/rxdb/schemas/thought';

interface ThoughtTitleProps {
  classes: any;
  thought: Thought;
  onUpdate: (thought: Thought) => void;
}

export const ThoughtTitle: FC<ThoughtTitleProps> = ({ classes, thought, onUpdate }) => {
  const [edittingTitle, setEdittingTitle] = useState<boolean>(false);
  const lastTitleClick = useRef<number>(0);
  const [inputtedTitle, setInputtedTitle] = useState<string>(thought.title);

  const handleClickTitle: MouseEventHandler<Element> = e => {
    const currentTitleClick = +new Date();
    if (currentTitleClick - lastTitleClick.current < 500) {
      setEdittingTitle(true);
    }
    lastTitleClick.current = currentTitleClick;
  };

  const handleSubmitTitle: FormEventHandler = e => {
    e.preventDefault();
    onUpdate({
      ...thought,
      title: inputtedTitle,
    });
    setEdittingTitle(false);
  };

  const handleCancelTitle: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    setInputtedTitle(thought.title);
    setEdittingTitle(false);
  };

  useEffect(() => {
    setInputtedTitle(thought.title);
  }, [thought]);

  if (!edittingTitle) {
    return <h1 className={classes.thoughtTitle} onClick={handleClickTitle}>{thought.title}</h1>;
  }
  
  return (
    <form className={classes.editTitleForm} onSubmit={handleSubmitTitle}>
      <button className={classes.submitTitleButton}><Check/></button>
      <button className={classes.cancelTitleButton} onClick={handleCancelTitle}><Close/></button>
      <Input
        classes={classes}
        id={'title'}
        value={inputtedTitle}
        onChange={e => setInputtedTitle(e.target.value)}
        autoFocus
      />
    </form>
  );
};

export default ThoughtTitle;
