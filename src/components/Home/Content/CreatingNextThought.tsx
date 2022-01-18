import React, { CSSProperties, FC, useEffect, useRef, useState } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import cn from 'classnames';
import Check from '@material-ui/icons/Check';

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'grid',
    gridTemplateAreas: `"title title"
                        "parent check"`,
    gridTemplateRows: 'max-content max-content',
    gridTemplateColumns: '1fr max-content',
    gridRowGap: '5px',
    padding: '5px 15px',
    backgroundColor: theme.palette.background[200],
  },
  titleLabel: {
    gridArea: 'title',
    '& input': {
      width: '100%',
    },
  },
  parentLabel: {
    gridArea: 'parent',
    display: 'flex',
    alignItems: 'center',
  },
  checkButton: {
    gridArea: 'check',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.primary[600],
  },
});

export type CreatableThought = {
  title: string;
  relationship: 'next' | 'from';
}

export interface CreatingNextThoughtProps {
  className?: string;
  classes: any;
  styleOverwrite?: CSSProperties;
  onSubmit: (creatableThought: CreatableThought) => void;
}

export const CreatingNextThought: FC<CreatingNextThoughtProps> = ({
  className,
  classes,
  styleOverwrite = {},
  onSubmit,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState('');
  const [isParent, setIsParent] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit({ title, relationship: isParent ? 'from' : 'next' });
  };

  useEffect(() => {
    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },  []);

  return (
    <form ref={formRef} style={styleOverwrite} className={cn(classes.root, className)} onSubmit={handleSubmit}>
      <label className={classes.titleLabel}>
        Title
        <input type={'text'} value={title} autoFocus onChange={e => setTitle(e.target.value)} />
      </label>
      <label className={classes.parentLabel}>
        <input type={'checkbox'} checked={isParent} onChange={e => setIsParent(e.target.checked)} />
        Create as Parent Thought
      </label>
      <button className={classes.checkButton}>
        <Check fontSize='small'/>
      </button>
    </form>
  );
};

export default withStyles(styles)(CreatingNextThought)
