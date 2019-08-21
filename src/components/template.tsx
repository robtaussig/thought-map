import React, { useContext, Fragment, FC } from 'react';
import { Context } from '../store';
import { withStyles, StyleRules } from '@material-ui/core/styles';

interface TemplateProps {
  classes: any,
}

const styles = (theme: any): StyleRules => ({

});

export const Template: FC<TemplateProps> = React.memo(({ classes }) => {
  const dispatch = useContext(Context);

  return (
    <Fragment>
      Hello!
    </Fragment>
  );
});

export default withStyles(styles)(Template);
