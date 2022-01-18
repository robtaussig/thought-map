import React, { FC } from 'react';
import { Plan as PlanType } from '../../../../store/rxdb/schemas/plan';
import Base from '../Base';
import { format } from 'date-fns';

interface PlanProps {
  classes: any;
  plan: PlanType;
  rootClassName: string;
}

export const Plan: FC<PlanProps> = ({
    classes,
    rootClassName,
    plan,
}) => {
    const { id, updated, created, ...restOfPlan } = plan;

    return (
        <Base
            classes={classes}
            rootClassName={rootClassName}
            header={'Plan'}
            subHeader={plan.name}
            mainField={`Created ${format(plan.created, 'yyyy-MM-dd HH:mm')}`}
            fields={restOfPlan}
        />
    );
};

export default Plan;
