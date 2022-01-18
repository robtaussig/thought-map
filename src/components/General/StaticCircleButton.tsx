import React, { FC, useRef } from 'react';
import Add from '@material-ui/icons/Add';
import classNames from 'classnames';

interface StaticCircleButtonProps {
  classes: any;
  id?: string;
  onClick: (event?: any) => void;
  label?: string;
  disabled?: boolean;
  emphasize?: boolean;
  Icon?: any;
  title?: string;
  svgRef?: React.Ref<HTMLElement>;
  [rest: string]: any;
}

export const StaticCircleButton: FC<StaticCircleButtonProps> = ({
  classes,
  id = 'add-button',
  onClick,
  label,
  disabled,
  Icon = Add,
  title,
  svgRef,
  emphasize,
  ...rest }) => {

  const buttonRef = useRef<HTMLButtonElement>(null);
  const isCancelled = useRef<boolean>(null);
  const isEnded = useRef<boolean>(null);

  const handleInteractionStart = (): void => {
    isCancelled.current = false;
    isEnded.current = false;
    !disabled && buttonRef.current.classList.add('touched');
  };

  const handleInteractionEnd = (e: (React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>)): void => {
    if (!disabled && isEnded.current === false && isCancelled.current === false) {
      isEnded.current = true;
      buttonRef.current.classList.remove('touched');
      e.preventDefault();
      onClick(e);
    }
  };

  const handleCancelInteraction = (): void => {
    if (isEnded.current === false && isCancelled.current !== true) {
      isCancelled.current = true;
      buttonRef.current.classList.remove('touched');
    }
  };

  return (
    <button
      id={id}
      ref={buttonRef}
      title={title}
      style={{ userSelect: 'none' }}
      className={classNames(classes.circleButton, { emphasize })}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onMouseMove={handleCancelInteraction}
      onTouchMove={handleCancelInteraction}
      aria-label={label}
      disabled={disabled}
      {...rest}
    >
      <Icon
        ref={svgRef}
      />
    </button>
  );
};

export default StaticCircleButton;
