import React, { FC } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';

interface LongPressTutorialProps {
  classes: any,
}

const styles = (theme: any): StyleRules => ({
    root: {

    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    text: {

    },
});

const TUTORIAL_TEXT = `
  Certain buttons perform different functions if long-pressed. 
  These buttons contain side-by-side icons, with the right-icon corresponding to the long-press action.
  Try long-pressing the settings/review button.
`;

export const LongPressTutorial: FC<LongPressTutorialProps> = ({ classes }) => {

    return (
        <div className={classes.root}>
            <h1 className={classes.header}>Long-Pressable Buttons</h1>
            <span className={classes.text}>{TUTORIAL_TEXT}</span>
        </div>
    );
};

export default withStyles(styles)(LongPressTutorial);
