import React, { FC } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { templates as templateActions } from '../../../actions';
import { useLoadedDB } from '../../../hooks/useDB';
import Delete from '@material-ui/icons/Delete';
import { openConfirmation } from '../../../lib/util';
import { useSelector } from 'react-redux';
import { templateSelector } from '../../../reducers/templates';

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
    color: theme.palette.secondary[700],
  },
  deleteTemplate: {
    color: theme.palette.red[500],
  },
});

export const DeleteTemplates: FC<DeleteTemplatesProps> = ({ classes, onClose }) => {
  const db = useLoadedDB();
  const templates = useSelector(templateSelector);

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
