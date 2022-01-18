import React, { FC } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';

interface PriorityTutorialProps {
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
  It can be difficult to keep track of important thoughts as more and more are added.
  A list of priorities is algorithmically generated and can be viewed by long-pressing
  the staging/priorities button.
`;

export const PriorityTutorial: FC<PriorityTutorialProps> = ({ classes }) => {

    return (
        <div className={classes.root}>
            <h1 className={classes.header}>Priorities</h1>
            <span className={classes.text}>{TUTORIAL_TEXT}</span>
        </div>
    );
};

export default withStyles(styles)(PriorityTutorial);
