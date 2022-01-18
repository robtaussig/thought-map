import React, { useCallback, useMemo, FC } from 'react';
import { withStyles, StyleRules } from '@material-ui/core/styles';
import Select from '../General/Select';
import { Template } from '../../store/rxdb/schemas/template';

const styles = (theme: any): StyleRules => ({
    root: () => ({
        position: 'fixed',
        height: '100%',
        left: 0,
        right: 0,
        backgroundColor: theme.useDarkMode ? '#2f2f2f' : theme.palette.background[500],
        opacity: 0.9,
        transition: 'all 0.3s linear',
    }),
    header: () => ({
        margin: '20px auto',
        textAlign: 'center',
        fontSize: '24px',
        color: theme.palette.background[0],
        fontWeight: 600,
    }),
    selectLabel: () => ({
        display: 'flex',
        flexDirection: 'column',
        color: theme.palette.background[200],
        margin: '110px 110px',
    }),
    selectInput: {
        flex: '0 0 40px',
        fontSize: 20,
        border: 'none',
    },
});

interface CreateThoughtSettingsProps {
  classes: any;
  display: boolean;
  templates: Template[];
  onClose: () => void;
  onCreateFromTemplate: (template: Template) => void;
}

export const CreateThoughtSettings: FC<CreateThoughtSettingsProps> = ({ classes, display, templates, onClose, onCreateFromTemplate }) => {
    const templateOptions = useMemo(() => {
        return ['', ...templates.map(template => template.name)];
    }, [templates]);

    const handleSelectTemplate = useCallback(event => {
        const template = templates.find(el => el.name === event.target.value);
        onCreateFromTemplate(template);
        onClose();
    }, [templates]);

    return (
        <div className={classes.root} style={{
            top: display ? 0 : '100%',
            visibility: display ? 'visible' : 'hidden',
        }}>
            <h1 className={classes.header}>Settings</h1>
            <Select
                classes={classes}
                value={''}
                options={templateOptions}
                onChange={handleSelectTemplate}
                label={'Create From Template'}
            />
        </div>
    );
};

export default withStyles(styles)(CreateThoughtSettings);
