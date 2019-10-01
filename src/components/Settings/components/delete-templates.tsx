import React, { FC } from 'react';
import { AppState } from '../../../reducers';
import { withStyles, StyleRules } from '@material-ui/styles';
import { templates as templateActions } from '../../../actions';
import { useLoadedDB } from '../../../hooks/useDB';
import { useModalDynamicState } from '../../../hooks/useModal';
import Delete from '@material-ui/icons/Delete';
import { openConfirmation } from '../../../lib/util';

interface DeleteTemplatesProps {
  classes: any;
  onClose: () => void;
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  template: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  templateText: {
    fontWeight: 600,
    color: 'white',
  },
  deleteTemplate: {
    color: theme.palette.red[500],
  },
});

export const DeleteTemplates: FC<DeleteTemplatesProps> = ({ classes, onClose }) => {
  const state: AppState = useModalDynamicState();
  const db = useLoadedDB();
  const templates = state.templates;

  const deleteTemplate = (templateId: string) => {
    openConfirmation('Are you sure you want to delete this template?', () => templateActions.deleteTemplate(db, templateId));
  };

  return (
    <div className={classes.root}>
      {templates.map(template => {
        return (
          <div key={template.name} className={classes.template}>
            <span className={classes.templateText}>{template.name}</span>
            <button className={classes.deleteTemplate} onClick={() => deleteTemplate(template.id)}><Delete/></button>
          </div>
        );
      })}
    </div>
  );
};

export default withStyles(styles)(DeleteTemplates);
