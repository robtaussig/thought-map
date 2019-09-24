import React, { FC, useEffect, useMemo, useRef, useState, FormEventHandler, ChangeEvent, MouseEventHandler } from 'react';
import Edit from '@material-ui/icons/Edit';
import ArrowRight from '@material-ui/icons/ArrowRight';
import Check from '@material-ui/icons/Check';
import classNames from 'classnames';
import TextArea from '../../General/TextArea';
import Select from '../../General/Select';
import DateInput from '../../General/Date';
import Input from '../../General/Input';
import {
  EditTypes,
  EditProps,
} from '../types';

interface ThoughtSectionProps {
  classes: any;
  Icon: any;
  field: string;
  value: string;
  className: string;
  edit: EditProps;
  visible: boolean;
  quickActionButton?: any;
}

export const ThoughtSection: FC<ThoughtSectionProps> = ({ classes, Icon = ArrowRight, field, value, className, edit, visible, quickActionButton }) => {  
  const [editting, setEditting] = useState<boolean>(false);
  const lastClick = useRef<number>(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const [inputtedValue, setInputtedValue] = useState<string>(String(value));

  const handleToggleEdit = () => {
    if (editting) {
      if (inputtedValue !== String(value)) {
        edit.onEdit(inputtedValue);
      }
    }
    setEditting(prev => !prev);    
  };

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault();
    edit.onEdit(inputtedValue);
    setEditting(false);
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    edit.onEdit(e.target.value);
    setInputtedValue(e.target.value);
    setEditting(false);
  };

  const _editComponent = useMemo(() => {
    switch (edit.type) {
      case EditTypes.Select:
        return (
          <Select
            classes={classes}
            id={'section-editor'}
            value={value}
            onChange={handleSelect}
            options={edit.options}
          />
        );
      case EditTypes.TextArea:
        return (
          <TextArea
            classes={classes}
            id={'section-editor'}
            value={inputtedValue}
            onChange={e => setInputtedValue(e.target.value)}
            autoFocus
          />
        );
      case EditTypes.DateTime:
        const [inputtedDate, inputtedTime] = inputtedValue.split(',');
        const handleSetDate = (e: any) => {
          const date = e.target.value;
          setInputtedValue(prev => prev.split(',').map((val, idx) => idx === 0 ? date : val).join(','));
        };
        const handleSetTime = (e: any) => {
          const time = e.target.value;
          setInputtedValue(prev => prev.split(',').map((val, idx) => idx === 1 ? time : val).join(','));
        };
        return (
          <div>
            <DateInput classes={classes} value={inputtedDate} onChange={handleSetDate}/>
            <DateInput classes={classes} value={inputtedTime} time onChange={handleSetTime}/>
          </div>
        );
    
      default:
        return (
          <Input
            classes={classes}
            id={'section-editor'}
            value={inputtedValue}
            onChange={e => setInputtedValue(e.target.value)}
            autoFocus
          />
        );
    }
  }, [inputtedValue, edit]);

  const handleClickValue: MouseEventHandler<Element> = e => {
    const currentClick = +new Date();
    if (currentClick - lastClick.current < 500) {
      setEditting(true);
    }
    lastClick.current = currentClick;
  };

  useEffect(() => {
    if (editting) {
      const handleBodyClick = (e: any) => {
        if (!rootRef.current.contains(e.target)) {
          setEditting(false);
        }       
      };

      document.body.addEventListener('click', handleBodyClick);

      return () => document.body.removeEventListener('click', handleBodyClick);
    }
  }, [editting]);

  const displayValue = edit.type === EditTypes.DateTime ? value.split(',').join(' ') : value;

  return (
    <section ref={rootRef} className={classNames(classes.thoughtSection, className)}>
      <button className={classes.editToggle} onClick={handleToggleEdit}>{editting ? (<Check/>) : (<Edit/>)}</button>
      <div className={classes.sectionIcon}>
        <Icon/>
      </div>
      {editting ? (
        <form className={classes.sectionEditForm} onSubmit={handleSubmit}>
          {_editComponent}
        </form>
      ) : (<h3 className={classes.sectionValue} onClick={handleClickValue}>{displayValue}</h3>)}
      <span className={classes.sectionField}>{field}</span>
      <div className={classes.sectionQuickActionButton}>
        {quickActionButton}
      </div>
    </section>
  );
};

export default ThoughtSection;
