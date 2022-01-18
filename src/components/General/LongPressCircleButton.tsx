import React, { useRef, FC, ChangeEvent, CSSProperties } from 'react';
import Add from '@material-ui/icons/Add';
import SentimentDissatisfied from '@material-ui/icons/SentimentDissatisfied';
import useLongPress from '../../hooks/useLongPress';
import classNames from 'classnames';

interface LongPressCircleButtonProps {
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

const longPressIconStyles: CSSProperties = {
    color: '#9c9c9c',
};

export const LongPressCircleButton: FC<LongPressCircleButtonProps> = React.memo(({
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

    const buttonRef = useRef<HTMLButtonElement>(null);
    const isCancelled = useRef<boolean>(null);
    const isEnded = useRef<boolean>(null);

    const handleInteractionStart = (): void => {
        isCancelled.current = false;
        isEnded.current = false;
        !disabled && buttonRef.current.classList.add('touched');
    };

    const handleInteractionEnd = (): void => {
        if (!disabled && isEnded.current === false && isCancelled.current === false) {
            isEnded.current = true;
            buttonRef.current.classList.remove('touched');
        }
    };
    const handleCancelInteraction = (): void => {
        if (isEnded.current === false && isCancelled.current !== true) {
            isCancelled.current = true;
            buttonRef.current.classList.remove('touched');
        }
    };

    const handleLongPress = useLongPress(onLongPress, 300, {
        onStart: handleInteractionStart,
        onEnd: handleInteractionEnd,
        onCancel: handleCancelInteraction,
        onClick,
    });

    return (
        <button
            id={id}
            ref={buttonRef}
            title={title}
            style={{ userSelect: 'none' }}
            className={classNames(classes.circleButton, { emphasize })}
            aria-label={label}
            disabled={disabled}
            {...handleLongPress}
            {...rest}
        >
            {disabled ? <SentimentDissatisfied /> : <Icon
                ref={svgRef}
            />}
            {LongPressIcon && <LongPressIcon style={longPressIconStyles} />}
        </button>
    );
});

export default LongPressCircleButton;
