import React, { useEffect, Fragment, FC, Dispatch } from 'react';
import Input from '../General/Input';
import Select from '../General/Select';
import { useNestedXReducer, Action } from '../../hooks/useXReducer';
import { CreatedThought } from './';

interface InputsProps {
  classes: any;
  createdThought: CreatedThought;
  dispatch: Dispatch<Action>;
  typeOptions: string[];
  tagOptions: string[];
  onReady: (ready: boolean) => void;
  thoughtTitles: string[];
}

export const Inputs: FC<InputsProps> = React.memo(({
  classes,
  createdThought,
  dispatch,
  typeOptions,
  tagOptions,
  thoughtTitles,
  onReady,
}) => {
  const [title, setTitle] = useNestedXReducer('title', createdThought, dispatch);
  const [type, setType] = useNestedXReducer('type', createdThought, dispatch);

  const isReady = validateInputs(title);

  useEffect(() => {
    onReady(isReady);
  }, [isReady]);

  return (
    <Fragment>
      <Input classes={classes} id={'title'} value={title} onChange={e => setTitle(e.target.value)} autoSuggest={thoughtTitles} autoFocus/>
      <Select classes={classes} id={'type'} value={type} options={typeOptions} onChange={e => setType(e.target.value)}/>
    </Fragment>
  );
});

export default Inputs;

const validateInputs = (title: string): boolean => {
  return title !== '';
};
