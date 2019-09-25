import React, { useState, useMemo, useRef, FC, FormEventHandler, MouseEventHandler } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Category from '@material-ui/icons/Category';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import Check from '@material-ui/icons/Check';
import NotesIcon from '@material-ui/icons/Notes';
import Close from '@material-ui/icons/Close';
import LowPriority from '@material-ui/icons/LowPriority';
import Description from '@material-ui/icons/Description';
import PriorityHighRounded from '@material-ui/icons/PriorityHighRounded';
import CalendarToday from '@material-ui/icons/CalendarToday';
import { handleUpdates, getTime } from './util';
import { notes as noteActions, tags as tagActions, statuses as statusActions } from '../../actions';
import { useLoadedDB } from '../../hooks/useDB';
import Input from '../General/Input';
import { thoughtInformationStyles } from './styles';
import {
  EditTypes,
} from './types';
import { PriorityOption } from './'
import { Notes, Settings } from 'reducers';
import { Thought } from 'store/rxdb/schemas/thought';
import { Picture } from 'store/rxdb/schemas/picture';
import { Tag } from 'store/rxdb/schemas/tag';
import { Note as NoteType } from 'store/rxdb/schemas/note';
import { Status as StatusType } from 'store/rxdb/schemas/status';
import ThoughtSection from './components/ThoughtSection';

export interface ThoughtInformationProps {
  classes: any;
  thought: Thought;
  tags: Tag[];
  notes: NoteType[];
  statusOptions: string[];
  typeOptions: string[];
  tagOptions: string[];
  priorityOptions: PriorityOption[];
  onUpdate: (thought: Thought) => void;
  editState: boolean;
  onEditState: (edit: boolean) => void;
  stateNotes: Notes;
  stateSettings: Settings;
  statuses: StatusType[];
  pinnedPictures: Picture[];
}

export const ThoughtInformation: FC<ThoughtInformationProps> = React.memo(({
  classes,
  thought,
  tags = [],
  notes = [],
  statusOptions = [],
  typeOptions = [],
  tagOptions = [],
  priorityOptions = [],
  onUpdate,
  editState,
  onEditState,
  stateNotes,
  stateSettings,
  statuses,
  pinnedPictures,
}) => {
  const [edittingTitle, setEdittingTitle] = useState<boolean>(false);
  const lastTitleClick = useRef<number>(0);
  const [inputtedTitle, setInputtedTitle] = useState<string>(thought.title);

  const db = useLoadedDB();
  const [createdText, lastUpdatedText]: [string, string] = useMemo(() => {
    if (statuses && statuses.length > 0) {
      return [getTime(statuses[statuses.length - 1].updated), getTime(statuses[0].created)];
    }

    return [getTime(thought.created), getTime(thought.updated)];
  }, [thought, statuses]);

  const handleEditThought = (field: string) => (value: any) => {
    onUpdate({
      ...thought,
      [field]: value,
    });
  };
  
  const handleEditStatus = (value: string) => {
    statusActions.createStatus(db, {
      text: value,
      thoughtId: thought.id,
    });
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

  const handleClickTitle: MouseEventHandler<Element> = e => {
    const currentTitleClick = +new Date();
    if (currentTitleClick - lastTitleClick.current < 500) {
      setEdittingTitle(true);
    }
    lastTitleClick.current = currentTitleClick;
  };

  const handleEditDateTime = (datetime: any) => {
    const [date, time] = datetime.split(',');
    onUpdate({
      ...thought,
      date: date || '',
      time: time || '',
    });
  };

  const handleEditNote = (idx: number, value: string) => {
    noteActions.editNote(db, {
      ...notes[idx],
      text: value,
    });
  };

  const handleCreateNote = (value: string) => {
    noteActions.createNote(db, {
      thoughtId: thought.id,
      text: value,
    });
  };

  const handleDeleteNote = (idx: number) => {
    noteActions.deleteNote(db, notes[idx].id);
  };

  const dateTimeText = `${thought.date},${thought.time}`;

  return (
    <div className={classes.root}>
      {edittingTitle ?
        (
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
        ) : 
        (<h1 className={classes.thoughtTitle} onClick={handleClickTitle}>{thought.title}</h1>)}
      <span className={classes.createdAt}>Created {createdText}</span>
      <span className={classes.updatedAt}>Updated {lastUpdatedText}</span>
      <div className={classes.thoughtSections}>
        <ThoughtSection
          classes={classes}
          Icon={Category}
          field={'Type'}
          value={thought.type}
          className={'type'}
          visible={true}
          edit={{
            type: EditTypes.Select,
            options: typeOptions,
            onEdit: handleEditThought('type'),
            onChangeVisibility: console.log,
          }}
        />
        <ThoughtSection
          classes={classes}
          Icon={thought.status === 'completed' ? CheckBoxIcon : CheckBoxOutlineBlank}
          field={'Status'}
          value={thought.status}
          className={'status'}
          visible={true}
          quickActionButton={thought.status !== 'completed' && (
            <button className={classes.completeThoughtButton} onClick={() => handleEditStatus('completed')}><Check/></button>
          )}
          edit={{
            type: EditTypes.Select,
            options: statusOptions,
            onEdit: handleEditStatus,
            onChangeVisibility: console.log,
          }}
        />
        <ThoughtSection
          classes={classes}
          Icon={LowPriority}
          field={'Priority'}
          value={priorityOptions.find(({ value }) => value === thought.priority).label}
          className={'priority'}
          visible={true}
          quickActionButton={thought.priority !== 10 && (
            <button className={classes.highPriorityButton} onClick={() => handleEditThought('priority')(10)}><PriorityHighRounded/></button>
          )}
          edit={{
            type: EditTypes.Select,
            options: priorityOptions.map(({ label }) => label),
            onEdit: value => handleEditThought('priority')(priorityOptions.find(({ label }) => label === value).value),
            onChangeVisibility: console.log,
          }}
        />
        <ThoughtSection
          classes={classes}
          Icon={Description}
          field={'Description'}
          value={thought.description}
          className={'description'}
          visible={true}
          edit={{
            type: EditTypes.TextArea,
            onEdit: handleEditThought('description'),
            onChangeVisibility: console.log,
          }}
        />
        <ThoughtSection
          classes={classes}
          Icon={CalendarToday}
          field={'Date/Time'}
          value={dateTimeText}
          className={'datetime'}
          visible={true}
          edit={{
            type: EditTypes.DateTime,
            onEdit: handleEditDateTime,
            onChangeVisibility: console.log,
          }}
        />
        <ThoughtSection
          classes={classes}
          Icon={NotesIcon}
          field={'Notes'}
          value={notes.map(note => note.text)}
          className={'notes'}
          visible={true}
          edit={{
            type: EditTypes.Text,
            onEdit: handleEditNote,
            onCreate: handleCreateNote,
            onDelete: handleDeleteNote,
            onChangeVisibility: console.log,
          }}
        />
      </div>
    </div>
  )
});

export default withStyles(thoughtInformationStyles)(ThoughtInformation);


// import React, { useCallback, useState, useMemo, useEffect, useRef, Fragment, FC } from 'react';
// import Note from '@material-ui/icons/Note';
// import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
// import PriorityHighRounded from '@material-ui/icons/PriorityHighRounded';
// import Header from '../General/Header';
// import Select from '../General/Select';
// import Input from '../General/Input';
// import TextArea from '../General/TextArea';
// import Date from '../General/Date';
// import CircleButton from '../General/CircleButton';
// import Edit from '@material-ui/icons/Edit';
// import Check from '@material-ui/icons/Check';
// import Delete from '@material-ui/icons/Delete';
// import { openConfirmation } from '../../lib/util';
// import { notes as noteActions, tags as tagActions, statuses as statusActions } from '../../actions';
// import { useLoadedDB } from '../../hooks/useDB';
// import useAutoSuggest from 'react-use-autosuggest';
// import {
//   ThoughtInformationProps,
//   EditedMap,
//   ChangeType,
// } from './types';
// import { handleUpdates, getTime } from './util';

// export const ThoughtInformation: FC<ThoughtInformationProps> = React.memo(({
//   classes,
//   thought,
//   tags = [],
//   notes = [],
//   statusOptions = [],
//   typeOptions = [],
//   tagOptions = [],
//   priorityOptions = [],
//   onUpdate,
//   editState,
//   onEditState,
//   stateNotes,
//   stateSettings,
//   statuses,
//   pinnedPictures,
// }) => {
//   const [edittingTime, setEdittingTime] = useState<boolean>(false);
//   const [edittingDate, setEdittingDate] = useState<boolean>(false);
//   const [edittedNotes, setEdittedNotes] = useState<EditedMap>({});
//   const [edittedTitle, setEdittedTitle] = useState<string>(thought.title);
//   const [edittedDescription, setEdittedDescription] = useState<string>(thought.description);
//   const [addedNotes, setAddedNotes] = useState<string[]>([]);
//   const [addedTags, setAddedTags] = useState<string[]>([]);
//   const lastNoteRef = useRef<HTMLInputElement>(null);
//   const db = useLoadedDB();
//   const [lastNote, setLastNote] = useState<[number, string, boolean?]>([null, '']);
//   const autoSuggestNotes = useMemo(() => {
//     return stateSettings.useAutoSuggest ? Object.values(stateNotes).map(({ text }) => text) : [];
//   }, [stateNotes, stateSettings.useAutoSuggest]);
//   const noteSuggestions = useAutoSuggest(lastNote[1].trim(), autoSuggestNotes, 4);
//   const handleStatusChange = useCallback(event => {
//     statusActions.createStatus(db, {
//       text: event.target.value,
//       thoughtId: thought.id,
//     });
//     onEditState(false);
//   }, [thought]);

//   const [createdText, lastUpdatedText]: [string, string] = useMemo(() => {
//     if (statuses && statuses.length > 0) {
//       return [getTime(statuses[statuses.length - 1].updated), getTime(statuses[0].created)];
//     }

//     return [getTime(thought.created), getTime(thought.updated)];
//   }, [thought, statuses]);

//   const handlePriorityChange = useCallback(event => {
//     const value = priorityOptions.find(({ label }) => label === event.target.value).value;
//     onUpdate({ ...thought, priority: value });
//     onEditState(false);
//   }, [thought]);

//   const handleSetTime = useCallback(event => {
//     setEdittingTime(false);
//     onUpdate({ ...thought, time: event.target.value })
//   }, [thought]);

//   const handleSetDate = useCallback(event => {
//     setEdittingDate(false);
//     onUpdate({ ...thought, date: event.target.value })
//   }, [thought]);

//   const handleClickEdit = useCallback(() => {
//     onEditState(true);
//   }, []);

//   const reset = useCallback(() => {
//     setEdittingTime(false);
//     setEdittingDate(false);
//     setEdittedNotes({});
//     setAddedNotes([]);
//     setAddedTags([]);
//     setEdittedTitle(thought.title);
//     setEdittedDescription(thought.description);
//     setLastNote([null, '']);
//   }, [thought]);

//   const handleClickCancelEdit = () => {
//     handleUpdates(db, addedNotes, addedTags.filter(tag => tag !== 'Select'), edittedNotes, thought, tags, notes, edittedTitle, edittedDescription, reset);
//     onEditState(false);
//   };
  
//   const handleTypeChange = useCallback(event => {
//     onUpdate({ ...thought, type: event.target.value })
//   }, [thought]);

//   const handleInput = useCallback((id: any) => {
//     return (e: ChangeType, isNew: boolean = false) => {      
//       const value = e.target.value;
//       if (isNew) {
//         setLastNote([id, value, true]);
//         setAddedNotes(prev => prev.map((prevNote, prevIdx) => {
//           if (prevIdx === id) {
//             return value;
//           }
//           return prevNote;
//         }));
//       } else {
//         setLastNote([id, value]);
//         setEdittedNotes(prev => ({
//           ...prev,
//           [id]: value,
//         }));
//       }
//     };
//   }, []);

//   const handleDelete = useCallback((id: string, type: string): () => void => {
//     return () => {
//       const onConfirm = type === 'note' ?
//         () => noteActions.deleteNote(db, id) :
//         type === 'tag' ?
//         () => tagActions.deleteTag(db, id) :
//         () => {};

//       openConfirmation('Are you sure?', onConfirm);
//     };
//   }, []);

//   useEffect(reset,[thought, editState]);

//   const _autoSuggestComponent = useMemo(() => {

//     const handleClickSuggestion = (suggestionValue: string) => {
//       if (suggestionValue.startsWith(' ')) {
//         handleInput(lastNote[0])({
//           target: {
//             value: `${lastNote[1].trim()}${suggestionValue} `
//           }
//         }, lastNote[2])
//       } else {
//         handleInput(lastNote[0])({
//           target: {
//             value: lastNote[1].split(' ').map((word, idx) => {
//               if (idx === lastNote[1].split(' ').length - 1) {
//                 return suggestionValue;
//               } else {
//                 return word;
//               }
//             }).join(' ') + ' '
//           }
//         }, lastNote[2])
//       }
//       if (lastNoteRef.current && lastNoteRef.current.focus) lastNoteRef.current.focus();
//     };

//     if (noteSuggestions && noteSuggestions.length > 0) {
//       return (
//         <ul style={{
//           position: 'fixed',
//           display: 'flex',
//           bottom: '110px',
//           left: '0px',
//           right: '0px',
//           height: '80px',
//           backgroundColor: 'black',
//           alignItems: 'center',
//           justifyContent: 'space-around',
//           opacity: 0.7,
//           overflow: 'auto',
//         }}>
//           {noteSuggestions.map((suggestion, idx) => {
//             return (
//               <li
//                 key={`${suggestion}-${idx}`}
//                 style={{
//                   margin: '0 15px',
//                 }}
//               >
//                 <button
//                   style={{
//                     color: 'white',
//                   }}
//                   onClick={() => {
//                     handleClickSuggestion(suggestion);
//                   }}
//                 >
//                   {suggestion.replace(' ', '...')}
//                 </button>
//               </li>
//             )
//           })}
//         </ul>
//       );
//     }
//     return null;
//   }, [noteSuggestions, lastNote]);

//   const noteList = useMemo(() => {

//     const linkifyIfUrl = (text: string): any => {
//       if (/(^(http|www)).*(\.([A-z]{2,})(\/.*)?$)/.test(text)) {
//         return <a href={`http://${text.replace(/^http(s?):\/\//,'')}`} target={'_blank'} style={{ color: 'white' }}>{text}</a>;
//       } else {
//         return text;
//       }
//     };

//     return (
//       <ul className={classes.noteList}>
//         {notes
//           .sort((a, b) => a.created - b.created)
//           .map(({ text, id }, idx) => {
//             return editState ? (
//               <li className={classes.noteItem} key={`${idx}-note`}>
//                 <button className={classes.deleteIcon} onClick={handleDelete(id, 'note')}><Delete/></button>
//                 <input className={classes.noteEditInput} onChange={e => {
//                   handleInput(id)(e);
//                   lastNoteRef.current = e.target;
//                 }} value={edittedNotes[id] || text}/>
//               </li>
//             ) : (
//               <li className={classes.noteItem} key={`${idx}-note`}><Note className={classes.noteIcon}/>{(linkifyIfUrl(text))}</li>
//             );
//           }).concat(addedNotes.map((addedNote, idx) => {
//             return (
//               <li className={classes.noteItem} key={`${idx}-added-note`}>
//                 <button className={classes.deleteIcon} onClick={() => setAddedNotes(prev => prev.filter((_, prevIdx) => prevIdx !== idx))}><Delete/></button>
//                 <input className={classes.noteEditInput} onChange={e => {
//                   handleInput(idx)(e, true);
//                   lastNoteRef.current = e.target;
//                 }} value={addedNote}/>
//               </li>
//             )
//           }))
//         }
//         {editState && <button className={classes.addItem} onClick={() => setAddedNotes(prev => prev.concat(''))}>Add Note</button>}
//       </ul>
//     );
//   }, [classes, notes, edittedNotes, editState, addedNotes]);

//   const handleClickCompleteStatus = () => {
//     statusActions.createStatus(db, {
//       text: 'completed',
//       thoughtId: thought.id,
//     });
//   };

//   const handleClickPriorityButton = () => {
//     onUpdate({ ...thought, priority: 10 });
//   };

//   return (
//     <Fragment>
//       <div className={classes.thoughtInformation}>
//         {editState ? (
//           <Input
//             classes={classes}
//             value={edittedTitle}
//             onChange={e => setEdittedTitle(e.target.value)}
//             id={'thought-title'}
//           />
//         ) : (
//           <Header classes={classes} value={thought.title}/>
//         )}
//         <div className={classes.creationTimes}>
//           {createdText && (<span className={classes.timeText}>Created at {createdText}</span>)}
//           {lastUpdatedText && (<span className={classes.timeText}>Updated at {lastUpdatedText}</span>)}
//         </div>
//         {edittingTime || editState ? (
//           <Date
//             id={'time'}
//             classes={classes}
//             value={thought.time}
//             onChange={handleSetTime}
//             time
//             autoFocus={true}
//           />
//         ) : thought.time ? (
//           <span className={classes.thoughtTime}>{thought.time}</span>
//         ) : null}
//         {edittingDate || editState ? (
//           <Date
//             id={'date'}
//             classes={classes}
//             value={thought.date}
//             onChange={handleSetDate}
//             autoFocus={true}
//           />
//         ) : thought.date ? (
//           <span className={classes.thoughtDate}>{thought.date}</span>
//         ) : null}
//         {editState ? (<Select
//           id={'status'}
//           classes={classes}
//           value={thought.status}
//           options={statusOptions}
//           onChange={handleStatusChange}
//         />) : (
//           <span className={classes.statusText}>{thought.status}</span>
//         )}
//         {!editState &&
//           thought.status !== 'completed' &&
//           <button className={classes.completeButton} onClick={handleClickCompleteStatus}>
//             <CheckCircleOutlineIcon color={'primary'}/>
//           </button>
//         }
//         {editState && (
//           <Select
//             id={'priority'}
//             classes={classes}
//             value={priorityOptions.find(({ value }) => value === thought.priority).label}
//             options={priorityOptions.map(option => option.label)}
//             onChange={handlePriorityChange}
//           />
//         )}
//         {thought.priority !== 0 && !editState && (
//           <span className={classes.priorityText}>{priorityOptions.find(({ value }) => value === thought.priority).label}</span>
//         )}
//         {!editState &&
//           thought.priority > 0 &&
//           thought.priority < 10 && 
//           <button className={classes.priorityButton} onClick={handleClickPriorityButton}>
//             <PriorityHighRounded color={'primary'}/>
//           </button>
//         }
//         {editState ? (
//           <Select
//             id={'type'}
//             classes={classes}
//             value={thought.type}
//             options={typeOptions}
//             onChange={handleTypeChange}
//           />
//         ) : (
//           <span className={classes.thoughtType}>{thought.type}</span>
//         )}
//         {noteList}
//         <ul className={classes.tagList}>
//           {tags.map(({ text, id }, idx) => {
//             return (
//               <li className={classes.tagItem} key={`${idx}-note`}>{editState && (
//                 <button className={classes.deleteTagButton} onClick={handleDelete(id, 'tag')}><Delete className={classes.deleteTagIcon}/></button>
//               )}{text}</li>
//             );
//           }).concat(addedTags.map((addedTag, idx) => {
//             return (
//               <Select
//                 classes={classes}
//                 key={`${idx}-added-note`}
//                 value={addedTag}
//                 id={'added-tag'}
//                 options={tagOptions.filter(option => {
//                   return addedTag === option ||
//                     option === 'Select' ||
//                     tags.map(tag => tag.text).concat(addedTags).includes(option) === false;
//                 })}
//                 onChange={e => {
//                   const value = e.target.value;
//                   setAddedTags(prev => prev.map((prevValue, prevIdx) => prevIdx === idx ? value : prevValue));
//                 }}
//               />
//             );
//           }))}
//           {editState && <button className={`${classes.addItem} ${classes.tagItem}`} onClick={() => setAddedTags(prev => prev.concat('Select'))}>Add Tag</button>}
//         </ul>    
//         {editState ? (
//           <TextArea
//             id={'description'}
//             classes={classes}
//             value={edittedDescription}
//             onChange={e => setEdittedDescription(e.target.value)}
//             label={'Description'}
//           />
//         ) : (
//           <span className={classes.thoughtDescription}>
//             {thought.description}
//           </span>
//         )}
//         <div className={classes.pinnedPictures}>
//           {pinnedPictures.map(picture => {
//             {/* 
//               // @ts-ignore */}
//             return <img key={picture.id} src={picture.localUrl || picture.imgurUrl} className={classes.image} loading="lazy"/>;
//           })}
//         </div>
//       </div>
//       {editState ? (
//         <CircleButton classes={classes} id={'edit'} onClick={handleClickCancelEdit} label={'Cancel'} Icon={Check}/>
//       ) : (
//         <CircleButton classes={classes} id={'edit'} onClick={handleClickEdit} label={'Edit'} Icon={Edit}/>
//       )}
//       {_autoSuggestComponent}
//     </Fragment>
//   );
// });


// export default ThoughtInformation;
