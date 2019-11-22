import React, { useRef, FC, useCallback } from 'react';
import Add from '@material-ui/icons/Add';
import SentimentDissatisfied from '@material-ui/icons/SentimentDissatisfied';
import useLongPress from '../../hooks/useLongPress';
import { motion } from 'framer-motion';

type CircleButtonTapEvent = MouseEvent | TouchEvent | PointerEvent;

interface CircleButtonProps {
  classes?: any;
  id?: string;
  onClick: (event: any) => void;
  onLongPress?: () => void;
  label?: string;
  disabled?: boolean;
  Icon?: any;
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
  title,
  svgRef,
  onLongPress = () => {},
  ...rest
}) => {
  const blockLongPress = useRef<boolean>(false);
  const longPressHandler = useCallback(() => {
    if (blockLongPress.current === false) {
      onLongPress();
    }
  }, []);
  const handleLongPress = useLongPress(longPressHandler, 400);

  const handleTap = (e: CircleButtonTapEvent) => {
    blockLongPress.current = true;
    // onClick(e);
  };

  return (
    <motion.button
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.9,
        transition: { duration: 0.2 },
      }}
      onTap={handleTap}

      id={id}
      title={title}
      style={{ userSelect: 'none' }}
      className={classes.circleButton}
      aria-label={label}
      disabled={disabled}
      {...handleLongPress}
      onTouchEnd={onClick}
      {...rest}
    >
      {disabled ? <SentimentDissatisfied/> : <Icon ref={svgRef}/>}
    </motion.button>
  );
};

export default CircleButton;
