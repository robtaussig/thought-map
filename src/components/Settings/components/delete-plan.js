import React, { Fragment, useState } from 'react';
import CheckBox from '../../General/CheckBox';

export const DeletePlan = ({ classes }) => {
  const [withThoughts, setWithThoughts] = useState(false);
  
  return (
    <section className={classes.deletePlanSection}>
      <button className={classes.deletePlanButton}>
        Delete
      </button>
      <CheckBox
        id={'with-thoughts'}
        title={'Delete all thoughts associated with this plan'}
        classes={classes}
        isChecked={withThoughts}
        value={'Delete associated thoughts'}
        onChange={e => setWithThoughts(e.target.checked)}
        label={'Deleted associated thoughts'}
      />
    </section>
  );
};

export default DeletePlan;
