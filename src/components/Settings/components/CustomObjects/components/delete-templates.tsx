import React, { FC } from 'react';
import { templates as templateActions } from '../../../../../actions';
import { useLoadedDB } from '../../../../../hooks/useDB';
import Delete from '@material-ui/icons/Delete';
import { openConfirmation } from '../../../../../lib/util';
import { useSelector } from 'react-redux';
import { templateSelector } from '../../../../../reducers/templates';
import { useDeleteTemplateStyles } from '../styles';

export const DeleteTemplates: FC = () => {
  const classes = useDeleteTemplateStyles({});
  const { db } = useLoadedDB();
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
            <button className={classes.deleteTemplate} onClick={() => deleteTemplate(template.id)}><Delete /></button>
          </div>
        );
      })}
    </div>
  );
};

export default DeleteTemplates;
