import { Plan, Thought } from 'store/rxdb/schemas/types';
import { StatusCount } from './Plan';

export const sortPlansByLatestThought = (plans: Plan[], thoughts: Thought[]) => {
  const statusCounts: { [planId: string]: StatusCount } = {};
  const planIds: string[] = [];
  thoughts.forEach(({ planId, status }) => {
    if (!statusCounts[planId]) {
      planIds.push(planId);
      statusCounts[planId] = { unstarted: 0, started: 0, completed: 0 };
    }
    if (status === 'new') {
      statusCounts[planId].unstarted++;
    } else if (status === 'completed') {
      statusCounts[planId].completed++;
    } else if (status === 'in progress') {
      statusCounts[planId].started++;
    }
  });
  const planMap = plans.reduce<{ [planId: string]: Plan }>((acc, plan) => {
    acc[plan.id] = plan;
    return acc;
  }, {});
  return planIds
    .reduce<{ plan: Plan; statusCount: StatusCount }[]>((acc, planId) => {
      if (planMap[planId]) {
        acc.push({
          plan: planMap[planId],
          statusCount: statusCounts[planId],
        });
      }
      return acc;
    }, []);
};
