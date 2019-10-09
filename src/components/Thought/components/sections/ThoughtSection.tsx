import React, { FC, useEffect, useMemo, useRef, useState, FormEventHandler, ChangeEvent, MouseEventHandler, useCallback } from 'react';
import Edit from '@material-ui/icons/Edit';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
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
import useLongPress from '../../../../hooks/useLongPress';
import FullScreenImage from './PicturesSection/components/FullScreenImage';
import {
  EditTypes,
  EditProps,
  SectionState
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
  linkifyValues?: boolean;
  onLongPress: (e: any) => void;
  sectionState: SectionState;
  onDrop: () => void;
  onToggleVisibility: () => void;
}

export const ThoughtSection: FC<ThoughtSectionProps> = ({
  classes,
  Icon = ArrowRight,
  field,
  value,
  className,
  edit,
  visible,
  quickActionButton,
  linkifyValues,
  onLongPress = (cb: () => void) => {},
  sectionState,
  onDrop,
  onToggleVisibility,
}) => {  
  const [editting, setEditting] = useState<boolean>(false);
  const [fullScreenImage, setFullScreenImage] = useState<string>(null);
  const [edittedItems, setEdittedItems] = useState<string[]>([]);
  const [moved, setMoved] = useState<boolean>(false);
  const movedTimeout = useRef<NodeJS.Timer>(null);
  const [openModal, closeModal] = useModal();
  const rootRef = useRef<HTMLDivElement>(null);
  const [inputtedValue, setInputtedValue] = useState<string>(String(value));
  const handleLongPress = useLongPress(() => {
    onLongPress(() => {
      setMoved(true);
      movedTimeout.current = setTimeout(() => {
        setMoved(false);
      }, 400);
    });
  });

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
    if ([null, EditTypes.Photo].includes(edit.type)) {
      if (edit.onEdit) edit.onEdit();
    } else {
      setEditting(prev => !prev);    
    }
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

        case EditTypes.Number:
          _component = (
            <Input
              classes={classes}
              id={'section-editor'}
              value={inputtedValue}
              onChange={e => setInputtedValue(e.target.value)}
              type={'number'}
              autoFocus
            />
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
          {edit.options ? 
            (value.map((item, idx) => {
              return (
                <div key={`${item}-${idx}`} className={classes.editableItem}>
                  <span className={classes.quickItem}>{item}</span>
                  <button className={classes.deleteItemButton} onClick={() => edit.onDelete(idx)}><Delete/></button>
                </div>
              );
            })) :
            (value.map((item, idx) => {
              return (
                <div key={`${item}-${idx}`} className={classes.editableItem}>
                  <Input
                    classes={classes}
                    id={'quick-item-edit'}
                    value={edittedItems[idx]}
                    autoSuggest={edit.autoSuggest}
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
            }))
          }
        </div>
      );
    }
  }, [inputtedValue, edit, edittedItems, value]);

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

  const handleClickImage = (idx: number) => () => {
    const picture = value[idx];
    setFullScreenImage(picture);
  };

  const handleCloseFullScreenImage = useCallback(() => {
    setFullScreenImage(null);
  }, []);

  const _displayComponent = useMemo(() => {

    const linkify = (element: any): any => {
      if (linkifyValues) {
        if (/(^(http|www)).*(\.([A-z]{2,})(\/.*)?$)/.test(element)) {
          return <a href={`http://${element.replace(/^http(s?):\/\//,'')}`} target={'_blank'} style={{ color: 'black' }}>{element}</a>;
        } else {
          return element;
        }
      }
      return element;
    };

    if (typeof value === 'string') {
      const displayValue = edit.type === EditTypes.DateTime ? value.split(',').join(' ') : value;
      return (<h3 className={classes.sectionValue}>{linkify(displayValue)}</h3>);
    } else {
      return (
        <ul className={classes.itemList}>
          {value.map((item, idx) => {
            return edit.type === EditTypes.Photo ?
            // @ts-ignore
            (<img key={`${idx}-image`} src={item} className={classes.image} loading="lazy" onClick={handleClickImage(idx)}/>) :
            (
              <li key={`${item}-${idx}`} className={classes.noteItem} onClick={edit.onClickItem ? () => edit.onClickItem(item, idx) : undefined}>{linkify(item)}</li>
            );
          })}
        </ul>
      );
    }
  }, [value, edit]);

  const _quickActionButton = useMemo(() => {
    if (edit.disableQuickAction !== true && typeof value !== 'string') {

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
            options={edit.options}
            autoSuggest={edit.autoSuggest}
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

  useEffect(() => {
    return () => {
      if (movedTimeout.current) clearTimeout(movedTimeout.current);
    }
  }, []);

  useEffect(() => {
    if (sectionState === SectionState.EditingSection) {
      rootRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [sectionState]);

  const _editIcons = useMemo(() => {
    if (sectionState === SectionState.NotEditingAnySection) {
      return (
        <button className={classNames(classes.editToggle, {
          editting,
        })} onClick={handleToggleEdit}>{editting ? (<Check/>) : (<Edit/>)}</button>
      );
    }

    return (
      <button className={classNames(classes.editToggle, {
        visible,
      })} onClick={onToggleVisibility}>
        {visible ? (<Visibility/>) : (<VisibilityOff/>)}
      </button>
    );
  }, [editting, edittedItems, sectionState, quickActionButton, _quickActionButton, visible, inputtedValue]);

  if ([SectionState.EditingEverySection, SectionState.EditingOtherSection].includes(sectionState)) {
    return (
      <section
        ref={rootRef}
        className={classNames(classes.thoughtSection, className, 'drop-target')}
      >
        {_editIcons}
        <div className={classes.sectionIcon}>
          <Icon/>
        </div>
        <span className={classNames(classes.sectionField, 'drop-target')} title={'Double-click to edit'}>{field}</span>
        {sectionState === SectionState.EditingOtherSection && (<button className={classNames(classes.sectionValue, 'drop-target')} onClick={onDrop}>
          Place Above
        </button>)}
      </section>
    );
  }

  if (visible === false && sectionState !== SectionState.EditingSection) return null;

  return (
    <section
      ref={rootRef}
      className={classNames(classes.thoughtSection, className, { moved })}
      {...handleLongPress}
      style={{ userSelect: 'none' }}
    >
      {_editIcons}
      <div className={classes.sectionIcon} onClick={handleToggleEdit}>
        <Icon/>
      </div>
      <span className={classes.sectionField} title={'Double-click to edit'}>{field}</span>
      {editting ? _editComponent : _displayComponent}
      <div className={classes.sectionQuickActionButton}>
        {!editting && (quickActionButton || _quickActionButton)}
      </div>
      {fullScreenImage && (
        <FullScreenImage onClose={handleCloseFullScreenImage} image={fullScreenImage}/>
      )}
    </section>
  );
};

export default ThoughtSection;
