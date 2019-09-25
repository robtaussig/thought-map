import React, { FC, useEffect, useMemo, useRef, useState, FormEventHandler, ChangeEvent, MouseEventHandler } from 'react';
import Edit from '@material-ui/icons/Edit';
import ArrowRight from '@material-ui/icons/ArrowRight';
import Add from '@material-ui/icons/Add';
import Check from '@material-ui/icons/Check';
import Delete from '@material-ui/icons/Delete';
import classNames from 'classnames';
import TextArea from '../../../General/TextArea';
import Select from '../../../General/Select';
import DateInput from '../../../General/Date';
import Input from '../../../General/Input';
import useModal from '../../../../hooks/useModal';
import {
  EditTypes,
  EditProps,
} from '../../types';
import QuickAddModal from '../QuickAddModal';

interface ThoughtSectionProps {
  classes: any;
  Icon: any;
  field: string;
  value: string | string[];
  className: string;
  edit: EditProps;
  visible: boolean;
  quickActionButton?: any;
}

export const ThoughtSection: FC<ThoughtSectionProps> = ({ classes, Icon = ArrowRight, field, value, className, edit, visible, quickActionButton }) => {  
  const [editting, setEditting] = useState<boolean>(false);
  const [edittedItems, setEdittedItems] = useState<string[]>([]);
  const lastClick = useRef<number>(0);
  const [openModal, closeModal] = useModal();
  const rootRef = useRef<HTMLDivElement>(null);
  const [inputtedValue, setInputtedValue] = useState<string>(String(value));

  const handleToggleEdit = () => {
    if (editting) {
      if (typeof value === 'string') {
        if (inputtedValue !== String(value)) {
          edit.onEdit(inputtedValue);
        }
      } else {
        edittedItems.forEach((item, idx) => {
          if (item !== value[idx]) {
            edit.onEdit(idx, item);
          }
        });
      }
    }
    setEditting(prev => !prev);    
  };

  const _editComponent = useMemo(() => {
    if (typeof value === 'string') {
      let _component;
      switch (edit.type) {
        case EditTypes.Select:
          const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
            edit.onEdit(e.target.value);
            setInputtedValue(e.target.value);
            setEditting(false);
          };

          _component = (
            <Select
              classes={classes}
              id={'section-editor'}
              value={value}
              onChange={handleSelect}
              options={edit.options}
            />
          );
        break;
        case EditTypes.TextArea:
          _component = (
            <TextArea
              classes={classes}
              id={'section-editor'}
              value={inputtedValue}
              onChange={e => setInputtedValue(e.target.value)}
              autoFocus
            />
          );
          break;
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
          _component = (
            <div>
              <DateInput classes={classes} value={inputtedDate} onChange={handleSetDate} autoFocus/>
              <DateInput classes={classes} value={inputtedTime} time onChange={handleSetTime} autoFocus/>
            </div>
          );
          break;
      
        default:
          _component = (
            <Input
              classes={classes}
              id={'section-editor'}
              value={inputtedValue}
              onChange={e => setInputtedValue(e.target.value)}
              autoFocus
            />
          );
      }

      const handleSubmit: FormEventHandler = e => {
        e.preventDefault();
        edit.onEdit(inputtedValue);
        setEditting(false);
      };

      return (<form className={classes.sectionEditForm} onSubmit={handleSubmit}>{_component}</form>);
    } else {
      return (
        <div className={classes.sectionEditForm}>
          {value.map((item, idx) => {
            return (
              <div key={`${item}-${idx}`} className={classes.editableItem}>
                <Input
                  classes={classes}
                  id={'quick-item-edit'}
                  value={edittedItems[idx]}
                  onChange={e => {
                    const value = e.target.value;
                    setEdittedItems(prev => prev.map((prevItem, prevIdx) => {
                      if (prevIdx === idx) return value;
                      return prevItem;
                    }));
                  }}
                  aria-label={`Edit ${item}`}
                />
                <button className={classes.deleteItemButton} onClick={() => edit.onDelete(idx)}><Delete/></button>
              </div>
            );
          })}
        </div>
      );
    }
  }, [inputtedValue, edit, edittedItems]);

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

      const handleKeyDown = (e: any) => {
        if (e.key === 'Escape') {
          setEditting(false);
        }
      };

      document.body.addEventListener('click', handleBodyClick);
      document.body,addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.removeEventListener('click', handleBodyClick);
        document.body.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [editting]);


  const _displayComponent = useMemo(() => {
    if (typeof value === 'string') {
      const displayValue = edit.type === EditTypes.DateTime ? value.split(',').join(' ') : value;
      return (<h3 className={classes.sectionValue}>{displayValue}</h3>);
    } else {
      return (
        <ul className={classes.notesList}>
          {value.map((item, idx) => {
            return (
              <li key={`${item}-${idx}`} className={classes.noteItem}>{item}</li>
            );
          })}
        </ul>
      );
    }
  }, [value, edit]);

  const _quickActionButton = useMemo(() => {
    if (typeof value !== 'string') {

      const handleAfterClose = () => {
        console.log('after close');
      };

      const handleSubmit = (value: string) => {
        edit.onCreate(value);
        closeModal();
      };

      const handleClickAdd = () => {
        openModal(
          <QuickAddModal
            classes={classes}
            onClose={closeModal}
            onSubmit={handleSubmit}
          />
          , 'Add', { className: classes.addModal, afterClose: handleAfterClose });
      };

      return (
        <button className={classes.quickAddButton} onClick={handleClickAdd}>
          <Add/>
        </button>
      );
    }
  }, [value]);

  useEffect(() => {
    if (Array.isArray(value)) {
      setEdittedItems(value);
    } else {
      setInputtedValue(value);
    }
  }, [value]);

  return (
    <section ref={rootRef} className={classNames(classes.thoughtSection, className)}>
      <button className={classes.editToggle} onClick={handleToggleEdit}>{editting ? (<Check/>) : (<Edit/>)}</button>
      <div className={classes.sectionIcon}>
        <Icon/>
      </div>
      {editting ? _editComponent : _displayComponent}
      <span className={classes.sectionField} onClick={handleClickValue} title={'Double-click to edit'}>{field}</span>
      <div className={classes.sectionQuickActionButton}>
        {!editting && (quickActionButton || _quickActionButton)}
      </div>
    </section>
  );
};

export default ThoughtSection;
