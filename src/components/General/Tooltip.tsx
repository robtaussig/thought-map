import React, { FC } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import Help from '@material-ui/icons/Help';
import { useModal } from '../../hooks/useModal';
import classNames from 'classnames';

interface TooltipProps {
  classes: any;
  text: string;
  className?: string;
}

const styles = (theme: any): StyleRules => ({
    root: {
        marginLeft: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    icon: () => ({
        fontSize: 12,
        color: theme.palette.background[0],
    }),
    wrapper: {
        overflow: 'auto',
    }
});

export const Tooltip: FC<TooltipProps> = ({ classes, text, className }) => {
    const [openModal, closeModal] = useModal();

    const handleClickTooltip = (e: any) => {
        e.preventDefault();
        openModal(<span className={classes.wrapper}>{text}</span>, 'Tooltip');
    };

    return (
        <button className={classNames(classes.root, {
            [className]: Boolean(className)
        })} onClick={handleClickTooltip}>
            <Help className={classes.icon} />
        </button>
    );
};

export default withStyles(styles)(Tooltip);
