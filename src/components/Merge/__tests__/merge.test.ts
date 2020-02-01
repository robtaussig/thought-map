import { merge } from '../util';
import {
  Dump,
  Doc,
  Collection,
  MergeResults,
} from '../types';
import uuidv4 from 'uuid/v4';

const generateCollection = (name: string, docs: Doc[]): Collection => ({
  name,
  docs,
});

const genrateDoc = (fields: { [field: string]: any }, id: string = uuidv4(), updated: number = +new Date()): Doc => ({
  id,
  updated,
  ...fields,
});

describe('merge', () => {
  test('It finds documents unique to the right side', () => {
    const sameThoughtItems: Doc[] = [
      genrateDoc({ name: 'thought 1' }),
      genrateDoc({ name: 'thought 2' }),
      genrateDoc({ name: 'thought 3' }),
      genrateDoc({ name: 'thought 4' }),
    ];

    const samePlanItems: Doc[] = [
      genrateDoc({ name: 'plan 1' }),
      genrateDoc({ name: 'plan 2' }),
      genrateDoc({ name: 'plan 3' }),
      genrateDoc({ name: 'plan 4' }),
    ];

    const uniqueRightThoughtItems: Doc[] = [
      genrateDoc({ name: 'thought 5' }),
      genrateDoc({ name: 'thought 6' }),
    ];

    const uniqueRightPlanItems: Doc[] = [
      genrateDoc({ name: 'plan 5' }),
    ];
  
    const left: Dump = {
      collections: [
        generateCollection('thought', [
          ...sameThoughtItems,
        ]),
        generateCollection('plan', [
          ...samePlanItems,
        ]),
      ],
    };
  
    const right: Dump = {
      collections: [
        generateCollection('thought', [
          ...sameThoughtItems,
          ...uniqueRightThoughtItems,
        ]),
        generateCollection('plan', [
          ...samePlanItems,
          ...uniqueRightPlanItems,
        ]),
      ],
    };

    const { itemsToAdd, comparables }: MergeResults = merge(left, right);

    expect(comparables).toHaveLength(0);
    expect(itemsToAdd).toHaveLength(uniqueRightThoughtItems.length + uniqueRightPlanItems.length);
    expect(itemsToAdd.every(({ item }) => uniqueRightThoughtItems.includes(item) || uniqueRightPlanItems.includes(item))).toBe(true);
  });

  test('It does not return items unique to left side, because left side will be used as base of merge results', () => {
    const sameThoughtItems: Doc[] = [
      genrateDoc({ name: 'thought 1' }),
      genrateDoc({ name: 'thought 2' }),
      genrateDoc({ name: 'thought 3' }),
      genrateDoc({ name: 'thought 4' }),
    ];

    const samePlanItems: Doc[] = [
      genrateDoc({ name: 'plan 1' }),
      genrateDoc({ name: 'plan 2' }),
      genrateDoc({ name: 'plan 3' }),
      genrateDoc({ name: 'plan 4' }),
    ];

    const uniqueLeftThoughtItems: Doc[] = [
      genrateDoc({ name: 'thought 5' }),
      genrateDoc({ name: 'thought 6' }),
    ];

    const uniqueLeftPlanItems: Doc[] = [
      genrateDoc({ name: 'plan 5' }),
    ];
  
    const left: Dump = {
      collections: [
        generateCollection('thought', [
          ...sameThoughtItems,
          ...uniqueLeftThoughtItems,
        ]),
        generateCollection('plan', [
          ...samePlanItems,
          ...uniqueLeftPlanItems,
        ]),
      ],
    };
  
    const right: Dump = {
      collections: [
        generateCollection('thought', [
          ...sameThoughtItems,          
        ]),
        generateCollection('plan', [
          ...samePlanItems,          
        ]),
      ],
    };

    const { itemsToAdd, comparables }: MergeResults = merge(left, right);

    expect(comparables).toHaveLength(0);
    expect(itemsToAdd).toHaveLength(0);
  });

  test('Finds comparables that exist on both sides with different update times', () => {
    const sameThoughtItems: Doc[] = [
      genrateDoc({ name: 'thought 1' }),
      genrateDoc({ name: 'thought 2' }),
      genrateDoc({ name: 'thought 3' }),
    ];

    const similarThoughtItems: Doc[] = [
      genrateDoc({ name: 'thought 4' }),
      genrateDoc({ name: 'thought 5' }),
    ];
  
    const left: Dump = {
      collections: [
        generateCollection('thought', [
          ...sameThoughtItems,
          ...similarThoughtItems.map(item => ({
            ...item,
            updated: item.updated + 1000,
            name: `${item.name}_updated`
          }))
        ])
      ],
    };
  
    const right: Dump = {
      collections: [
        generateCollection('thought', [
          ...sameThoughtItems,
          ...similarThoughtItems,
        ])
      ],
    };

    const { itemsToAdd, comparables }: MergeResults = merge(left, right);

    expect(comparables).toHaveLength(2);
    expect(itemsToAdd).toHaveLength(0);
    expect(comparables[0][0].item.name).toEqual('thought 4_updated');
    expect(comparables[0][1].item.name).toEqual('thought 4');
  });
});
