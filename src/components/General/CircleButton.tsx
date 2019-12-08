import React, { useRef, FC, ChangeEvent, CSSProperties } from 'react';
import Add from '@material-ui/icons/Add';
import SentimentDissatisfied from '@material-ui/icons/SentimentDissatisfied';
import useLongPress from '../../hooks/useLongPress'; 

const EMPTY_LONG_PRESS = () => {};

interface CircleButtonProps {
  classes?: any;
  id?: string;
  onClick: (event?: ChangeEvent) => void;
  onLongPress?: () => void;
  label?: string;
  disabled?: boolean;
  Icon?: any;
  LongPressIcon?: any;
  title?: string;
  svgRef?: React.Ref<HTMLElement>;
  [rest: string]: any;
}

const longPressIconStyles: CSSProperties = {
  color: '#9c9c9c',
};

export const CircleButton: FC<CircleButtonProps> = React.memo(({
  classes,
  id = 'add-button',
  onClick,
  label,
  disabled,
  Icon = Add,
  LongPressIcon,
  title,
  svgRef,
  onLongPress,
  ...rest }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isCancelled = useRef<boolean>(null);

  const handleInteractionStart = (): void => {
    isCancelled.current = false;
    !disabled && buttonRef.current.classList.add('touched');
  };
  const handleInteractionEnd = (e: (React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>)): void => {
    buttonRef.current.classList.remove('touched');
    e.preventDefault();
    if (!disabled && isCancelled.current === false) {
      onClick();
    }
  };
  const handleCancelInteraction = (): void => {
    isCancelled.current = true;
    buttonRef.current.classList.remove('touched');
  };

  const handleLongPress = useLongPress(onLongPress || EMPTY_LONG_PRESS, 400, {
    onStart: handleInteractionStart,
    onEnd: handleInteractionEnd,
    onCancel: handleCancelInteraction,
  });

  return (
    <button
      id={id}
      ref={buttonRef}
      title={title}
      style={{ userSelect: 'none' }}
      className={classes.circleButton}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onMouseMove={handleCancelInteraction}
      onTouchMove={handleCancelInteraction}
      aria-label={label}
      disabled={disabled}
      {...(onLongPress ? handleLongPress : {})}
      {...rest}
    >
      {disabled ? <SentimentDissatisfied/> : <Icon
        ref={svgRef}
      />}
      {LongPressIcon && <LongPressIcon style={longPressIconStyles}/>}
    </button>
  );
});

export default CircleButton;
