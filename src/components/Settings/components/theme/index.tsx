import React, { FC, useState, Fragment, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Close from '@material-ui/icons/Close';
import Refresh from '@material-ui/icons/Refresh';
import CircleButton from '../../../../components/General/CircleButton';
import classNames from 'classnames';
import { useLoadedDB } from '../../../../hooks/useDB';
import CustomizeTheme from './customize-theme';
import { customThemeSelector, resetDefault } from '../../../../reducers/customTheme';
import { useThemeStyles } from './styles';
import { ViewPosition } from './types';

interface ThemeProps {

}

export const Theme: FC<ThemeProps> = ({ }) => {
  const customTheme = useSelector(customThemeSelector);
  const classes = useThemeStyles(customTheme);
  const dispatch = useDispatch();
  const [side, setSide] = useState<ViewPosition>(ViewPosition.Down);
  const rootRef = useRef(null);
  const db = useLoadedDB();
  const handleClickClose = useCallback(() => {
    setSide(ViewPosition.Down);
  }, []);

  const handleReset = () => dispatch(resetDefault());
  const handleSave = () => {
    console.log('saving');
  };

  return (
    <Fragment>
      <button className={classes.button} onClick={() => setSide(ViewPosition.Up)}>
        Theme
      </button>
      <div ref={rootRef} className={classNames(classes.container, {
        visible: side === ViewPosition.Up,
        hidden: side === ViewPosition.Down
      })} style={{
        top: side === ViewPosition.Down ? '100%' : 0,
      }}>
        <h1 className={classes.header}>Theme</h1>
        <CustomizeTheme />
        <button className={classes.saveButton} onClick={handleSave}>Save</button>
        {side === ViewPosition.Up && <CircleButton classes={classes} id={'close'} onClick={handleClickClose} label={'Close'} Icon={Close} />}
        {side === ViewPosition.Up && <CircleButton classes={classes} id={'reset'} onClick={handleReset} label={'Reset'} Icon={Refresh} />}
      </div>
    </Fragment>
  );
};

export default Theme;
