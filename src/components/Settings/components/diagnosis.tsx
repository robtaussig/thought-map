import React, { FC, useMemo, Fragment } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import Tooltip from '../../General/Tooltip';
import { useLoadedDB } from '../../../hooks/useDB';
import {
  DiagnosisChunks,
  FormattedResultActionEnum,
  SolutionTypes,
} from '../types';

import Thought from '../../../models/thoughts';
import Connection from '../../../models/connections';
import Plan from '../../../models/plans';
import Note from '../../../models/notes';
import Tag from '../../../models/tags';
import Template from '../../../models/templates';
import Picture from '../../../models/pictures';
import Setting from '../../../models/settings';
import { RxDatabase, RxDocumentTypeWithRev } from 'rxdb';

const modelsByTable: {
  [tableName: string]: {
    delete: ((db: RxDatabase, id: string) => Promise<any>),
    update: (db: RxDatabase, object: RxDocumentTypeWithRev<any>) => Promise<any> }
  } = {
  thought: { delete: Thought.delete, update: Thought.update },
  connection: { delete: Connection.delete, update: Connection.update },
  plan: { delete: Plan.delete, update: Plan.update },
  note: { delete: Note.delete, update: Note.update },
  tag: { delete: Tag.delete, update: Tag.update },
  template: { delete: Template.delete, update: Template.update },
  picture: { delete: Picture.delete, update: Picture.update },
  setting: { delete: Setting.delete, update: Setting.update },
};

import { jsonDump } from './data';

interface DiagnosisProps {
  classes: any,
  diagnosisChunks: DiagnosisChunks,
  onFix: () => void,
}

const styles = (theme: any): StyleRules => ({
  root: {
    overflow: 'auto',
  },
  diagnosis: {
    
  },
  actionType: {
    fontWeight: 600,
    fontSize: 12,
    '&:not(:first-child)': {
      margin: '5px 0',
    }
  },
  action: {
    border: '1px solid black',
    padding: 4,
  },
  title: {
    color: theme.palette.gray[800],
    fontWeight: 600,
    fontSize: 10,
  },
  furtherDetails: {
    fontSize: 10,
    color: theme.palette.gray[700],
  },
  affectedItems: {
    fontWeight: 600,
    fontSize: 10,
    margin: '4px 0',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 4,
  },
  table: {
    border: '1px solid black',
    backgroundColor: 'white',
    borderRadius: '3px',
    padding: '1px 3px',
  },
  tooltip: {
    justifyContent: 'center',
    overflow: 'auto',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 30,
    '& > button': {
      backgroundColor: 'white',
      color: 'dodgerblue',
      padding: '3px 15px',
      borderRadius: '5px',
    }
  },
});

export const Diagnosis: FC<DiagnosisProps> = ({ classes, diagnosisChunks, onFix }) => {
  const db = useLoadedDB();

  const _diagnosis = useMemo(() => {
    if (Object.keys(diagnosisChunks).length === 0) {
      return (
        <div className={classes.diagnosis}>
          Congratulations! Your data is perfect.
        </div>
      );
    }

    return (
      <div className={classes.diagnosis}>
        {Object.entries(diagnosisChunks).map(([actionType, chunks], actionIdx) => {          
          return (
            <Fragment key={`${actionIdx}-action`}>
              <h2 className={classes.actionType}>{actionType}</h2>
              <div className={classes.action}>
                {Object.entries(chunks).map(([title, { furtherDetails, items }], titleIdx) => {
                  return (
                    <Fragment key={`${titleIdx}-title`}>
                      <h3 className={classes.title}>{title}</h3>
                      {furtherDetails && <span className={classes.furtherDetails}>{furtherDetails}</span>}
                      <h4 className={classes.affectedItems}>Affected items</h4>
                      {items.map(({ item, table }, itemIdx) => {
                        return (
                          <div key={`${itemIdx}-item`} className={classes.item}>
                            <span className={classes.table}>{table}</span>
                            <Tooltip className={classes.tooltip} text={JSON.stringify(item)}/>
                          </div>
                        );
                      })}
                    </Fragment>
                  );
                })}
              </div>
            </Fragment>
          )
        })}
      </div>
    );
  }, [diagnosisChunks])

  const handleClickFixIssues = async () => {
    if (!diagnosisChunks[FormattedResultActionEnum.CAN_FIX]) {
      onFix();
      return;
    }

    await Promise.all(Object.values(diagnosisChunks[FormattedResultActionEnum.CAN_FIX]).reduce((queries, { items }) => {
      items.forEach(({ item, table, solution }) => {
        switch (solution) {
          case SolutionTypes.DELETE:
            queries.push(modelsByTable[table].delete(db, item.id));
            break;
        
          case SolutionTypes.NULL_OUT_PLAN_ID:
            queries.push(modelsByTable[table].update(db, {
              ...item,
              planId: '',
            }));
            break;
        }
      });
      return queries;
    }, [] as Promise<any>[]));
    
    onFix();
  };

  return (
    <div className={classes.root}>
      {_diagnosis}
      {(Object.keys(diagnosisChunks).length > 0) && (<div className={classes.actionButtons}>
        <button onClick={() => jsonDump(db)}>Backup data</button>
        <button onClick={handleClickFixIssues}>Fix issues</button>
      </div>)}
    </div>
  );
};

export default withStyles(styles)(Diagnosis);
