import React, {
  ChangeEvent,
  FC,
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
import FullScreenImage from './PicturesSection/components/FullScreenImage';
import { EditProps, EditTypes, SectionState } from '../../types';
import QuickAddModal from '../QuickAddModal';
import { Draggable } from 'react-beautiful-dnd';

interface ThoughtSectionProps {
  classes: any;
  Icon: any;
  field: string;
  value: string | any[];
  className: string;
  edit: EditProps;
  visible: boolean;
  quickActionButton?: any;
  linkifyValues?: boolean;
  sectionState: SectionState;
  section: string;
  sectionOrder: string[];
  onToggleVisibility: () => void;
}

const HTTP_REGEX = /(^(http|www)).*(\.([A-z]{2,})(\/.*)?$)/;
const HTTPS_REGEX = /^http(s?):\/\//;
const TEL_REGEX = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
const EMAIL_REGEX =
  /^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/;

export const ThoughtSection: FC<ThoughtSectionProps> = ({
  classes,
  sectionOrder,
  section,
  Icon = ArrowRight,
  field,
  value,
  className,
  edit,
  visible,
  quickActionButton,
  linkifyValues,
  sectionState,
  onToggleVisibility,
}) => {
  const [editting, setEditting] = useState<boolean>(false);
  const [fullScreenImage, setFullScreenImage] = useState<string>(null);
  const [edittedItems, setEdittedItems] = useState<
  (string | [string, string])[]
    >([]);
  const [openModal, closeModal] = useModal();
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
    if ([null, EditTypes.Photo].includes(edit.type)) {
      if (edit.onEdit) edit.onEdit();
    } else {
      setEditting((prev) => !prev);
    }
  };

  const _editComponent = useMemo(() => {
    if (typeof value === 'string') {
      let _component;
      switch (edit.type) {
        case EditTypes.Select:
          _component = (
            <Select
              classes={classes}
              id={'section-editor'}
              value={value}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                edit.onEdit(e.target.value);
                setInputtedValue(e.target.value);
                setEditting(false);
              }}
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
              onChange={(e) => setInputtedValue(e.target.value)}
              autoFocus
            />
          );
          break;
        case EditTypes.DateTime:
          _component = (
            <div>
              <DateInput
                classes={classes}
                value={inputtedValue.split(',')[0]}
                onChange={(e: any) => {
                  const date = e.target.value;
                  setInputtedValue((prev) =>
                    prev
                      .split(',')
                      .map((val, idx) => (idx === 0 ? date : val))
                      .join(',')
                  );
                }}
                autoFocus
              />
              <DateInput
                classes={classes}
                value={inputtedValue.split(',')[1]}
                time
                onChange={(e: any) => {
                  const time = e.target.value;
                  setInputtedValue((prev) =>
                    prev
                      .split(',')
                      .map((val, idx) => (idx === 1 ? time : val))
                      .join(',')
                  );
                }}
                autoFocus
              />
            </div>
          );
          break;

        case EditTypes.Number:
          _component = (
            <Input
              classes={classes}
              id={'section-editor'}
              value={inputtedValue}
              onChange={(e) => setInputtedValue(e.target.value)}
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
              onChange={(e) => setInputtedValue(e.target.value)}
              autoFocus
            />
          );
      }

      const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        edit.onEdit(inputtedValue);
        setEditting(false);
      };

      return (
        <form className={classes.sectionEditForm} onSubmit={handleSubmit}>
          {_component}
        </form>
      );
    } else {
      return (
        <div className={classes.sectionEditForm}>
          {edit.options
            ? value.map((item, idx) => {
              return (
                <div key={`${item}-${idx}`} className={classes.editableItem}>
                  <span className={classes.quickItem}>{item}</span>
                  <button
                    className={classes.deleteItemButton}
                    onClick={() => edit.onDelete(idx)}
                  >
                    <Delete />
                  </button>
                </div>
              );
            })
            : value.map((item, idx) => {
              return (
                <div key={`${item}-${idx}`} className={classes.editableItem}>
                  <Input
                    classes={classes}
                    id={'quick-item-edit'}
                    value={edittedItems[idx] as string}
                    autoSuggest={edit.autoSuggest}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEdittedItems((prev) =>
                        prev.map((prevItem, prevIdx) => {
                          if (prevIdx === idx) return value;
                          return prevItem;
                        })
                      );
                    }}
                    aria-label={`Edit ${item}`}
                  />
                  <button
                    className={classes.deleteItemButton}
                    onClick={() => edit.onDelete(idx)}
                  >
                    <Delete />
                  </button>
                </div>
              );
            })}
        </div>
      );
    }
  }, [inputtedValue, edit, edittedItems, value]);

  const handleClickImage = (idx: number) => () => {
    const picture = value[idx];
    setFullScreenImage(picture[0]);
  };

  const handleCloseFullScreenImage = useCallback(() => {
    setFullScreenImage(null);
  }, []);

  const _displayComponent = useMemo(() => {
    const linkify = (element: any): any => {
      if (linkifyValues) {
        if (HTTP_REGEX.test(element)) {
          return (
            <a
              href={`http://${element.replace(HTTPS_REGEX, '')}`}
              target={'_blank'}
              style={{ color: 'black' }}
              rel='noreferrer'
            >
              {element}
            </a>
          );
        } else if (TEL_REGEX.test(element)) {
          return (
            <a href={`tel:${element}`} style={{ color: 'black' }}>
              {element}
            </a>
          );
        } else if (EMAIL_REGEX.test(element)) {
          return (
            <a href={`mailto:${element}`} style={{ color: 'black' }}>
              {element}
            </a>
          );
        } else {
          return element;
        }
      }
      return element;
    };

    if (typeof value === 'string') {
      const displayValue =
        edit.type === EditTypes.DateTime ? value.split(',').join(' ') : value;
      return <h3 className={classes.sectionValue}>{linkify(displayValue)}</h3>;
    } else {
      return (
        <ul className={classes.itemList}>
          {value.map((item, idx) => {
            return edit.type === EditTypes.Photo ? (
              <div key={`${idx}-image`} className={classes.imageWrapper}>
                <img
                  src={item[0]}
                  className={classes.image}
                  loading='lazy'
                  onClick={handleClickImage(idx)}
                />
                <span className={classes.imageDescription}>{item[1]}</span>
              </div>
            ) : (
              <li
                key={`${item}-${idx}`}
                className={classes.noteItem}
                onClick={
                  edit.onClickItem
                    ? () => edit.onClickItem(item, idx)
                    : undefined
                }
              >
                {linkify(item)}
              </li>
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
        edit.onCreate(value.trim());
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
          />,
          'Add',
          { className: classes.addModal, afterClose: handleAfterClose }
        );
      };

      return (
        <button className={classes.quickAddButton} onClick={handleClickAdd}>
          <Add />
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

  const _editIcons = useMemo(() => {
    if (sectionState === SectionState.NotEditingAnySection) {
      return (
        <button
          className={classNames(classes.editToggle, {
            editting,
          })}
          onClick={handleToggleEdit}
        >
          {editting ? <Check /> : <Edit />}
        </button>
      );
    }

    return (
      <button
        className={classNames(classes.editToggle, {
          visible,
        })}
        onClick={onToggleVisibility}
      >
        {visible ? <Visibility /> : <VisibilityOff />}
      </button>
    );
  }, [
    editting,
    edittedItems,
    sectionState,
    quickActionButton,
    _quickActionButton,
    visible,
    inputtedValue,
  ]);

  if (
    [
      SectionState.EditingEverySection,
      SectionState.EditingOtherSection,
    ].includes(sectionState)
  ) {
    return (
      <section
        className={classNames(classes.thoughtSection, className, 'drop-target')}
      >
        {_editIcons}
        <div className={classes.sectionIcon}>
          <Icon />
        </div>
        <span
          className={classNames(classes.sectionField, 'drop-target')}
          title={'Double-click to edit'}
        >
          {field}
        </span>
      </section>
    );
  }

  if (visible === false && sectionState !== SectionState.EditingSection)
    return null;

  return (
    <Draggable key={field} draggableId={field} index={sectionOrder.indexOf(section)}>
      {(provided, snapshot) => (
        <section
          className={classNames(classes.thoughtSection, className)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={getStyle({
            draggableStyle: provided.draggableProps.style,
            isDragging: snapshot.isDragging,
          })}
        >
          {_editIcons}
          <div className={classes.sectionIcon} onClick={handleToggleEdit}>
            <Icon />
          </div>
          <span className={classes.sectionField} title={'Double-click to edit'}>
            {field}
          </span>
          {editting ? _editComponent : _displayComponent}
          <div className={classes.sectionQuickActionButton}>
            {!editting && (quickActionButton || _quickActionButton)}
          </div>
          {fullScreenImage && (
            <FullScreenImage
              onClose={handleCloseFullScreenImage}
              image={fullScreenImage}
            />
          )}
        </section>
      )}
    </Draggable>
   
  );
};

const getStyle = ({ draggableStyle }: any) => {
  const grid = 8;
  const result = {
    userSelect: 'none',
    padding: grid,
    margin: `0 0 ${grid}px 0`,
    ...draggableStyle
  };

  return result;
};

export default ThoughtSection;
