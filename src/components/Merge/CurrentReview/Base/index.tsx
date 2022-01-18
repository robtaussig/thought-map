import React, { FC, Fragment } from 'react';
import classNames from 'classnames';
import { format } from 'date-fns';

const parseValue = (field: string, value: any): string => {
  switch (field) {
  case 'created':
    return format(value, 'yyyy-MM-dd HH:mm');
  default:
    return String(value);
  }
};

interface BaseProps {
  classes: any;
  rootClassName: string;
  header: string;
  subHeader: string;
  mainField: string;
  fields: {
    [fieldName: string]: any;
  };
}

export const Base: FC<BaseProps> = ({
  classes,
  rootClassName,
  header,
  subHeader,
  mainField,
  fields,
}) => {

  return (
    <div className={classNames(classes.root, rootClassName)}>
      <h2 className={classes.header}>{header}</h2>
      <h3 className={classes.subHeader}>{subHeader}</h3>
      <h3 className={classes.mainField}>{mainField}</h3>
      <div
        className={classes.fields}
      >
        {Object.entries(fields)
          .filter(([field, value]) => !['', undefined, null].includes(value))
          .map(([field, value], idx) => {
            return (
              <Fragment
                key={`${field}-${idx}`}
              >
                <span className={classes.fieldName}>{field}</span>
                <span className={classes.fieldValue}>{parseValue(field, value)}</span>
              </Fragment>
            );
          })
        }
      </div>
    </div>
  );
};

export default Base;
