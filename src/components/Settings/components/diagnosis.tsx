import React, { FC, useMemo, Fragment } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import Tooltip from '../../General/Tooltip';
import {
  DiagnosisChunks,
} from '../types';

interface DiagnosisProps {
  classes: any,
  diagnosisChunks: DiagnosisChunks,
}

const styles = (theme: any): StyleRules => ({
  root: {

  },
  diagnosis: {
    overflow: 'auto',
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
});

export const Diagnosis: FC<DiagnosisProps> = ({ classes, diagnosisChunks }) => {

  const _diagnosis = useMemo(() => {
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
  return (
    <div className={classes.root}>
      {_diagnosis}
    </div>
  );
};

export default withStyles(styles)(Diagnosis);
