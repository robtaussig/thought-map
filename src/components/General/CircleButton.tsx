import React, { ChangeEvent, FC } from 'react';
import Add from '@material-ui/icons/Add';
import LongPressCircleButton from './LongPressCircleButton';
import StaticCircleButton from './StaticCircleButton';

interface CircleButtonProps {
  classes: any;
  id?: string;
  onClick: (event?: ChangeEvent) => void;
  onLongPress?: () => void;
  label?: string;
  disabled?: boolean;
  emphasize?: boolean;
  Icon?: any;
  LongPressIcon?: any;
  title?: string;
  svgRef?: React.Ref<HTMLElement>;
  [rest: string]: any;
}

export const CircleButton: FC<CircleButtonProps> = ({
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
  emphasize,
  ...rest }) => {

  if (onLongPress) {
    return (
      <LongPressCircleButton
        classes={classes}
        id={id}
        onClick={onClick}
        label={label}
        disabled={disabled}
        Icon={Icon}
        LongPressIcon={LongPressIcon}
        title={title}
        svgRef={svgRef}
        onLongPress={onLongPress}
        emphasize={emphasize}
        {...rest}
      />
    );
  } else {
    return (
      <StaticCircleButton
        classes={classes}
        id={id}
        onClick={onClick}
        label={label}
        disabled={disabled}
        Icon={Icon}
        title={title}
        svgRef={svgRef}
        emphasize={emphasize}
        {...rest}
      />
    );
  }
};

export default CircleButton;
