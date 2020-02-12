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

const generateDoc = (fields: { [field: string]: any }, id: string = uuidv4(), updated: number = +new Date()): Doc => ({
  id,
  updated,
  ...fields,
});

describe('merge', () => {
  test('It finds documents unique to the right side', () => {
    const sameThoughtItems: Doc[] = [
      generateDoc({ name: 'thought 1' }),
      generateDoc({ name: 'thought 2' }),
      generateDoc({ name: 'thought 3' }),
      generateDoc({ name: 'thought 4' }),
    ];

    const samePlanItems: Doc[] = [
      generateDoc({ name: 'plan 1' }),
      generateDoc({ name: 'plan 2' }),
      generateDoc({ name: 'plan 3' }),
      generateDoc({ name: 'plan 4' }),
    ];

    const uniqueRightThoughtItems: Doc[] = [
      generateDoc({ name: 'thought 5' }),
      generateDoc({ name: 'thought 6' }),
    ];

    const uniqueRightPlanItems: Doc[] = [
      generateDoc({ name: 'plan 5' }),
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
      generateDoc({ name: 'thought 1' }),
      generateDoc({ name: 'thought 2' }),
      generateDoc({ name: 'thought 3' }),
      generateDoc({ name: 'thought 4' }),
    ];

    const samePlanItems: Doc[] = [
      generateDoc({ name: 'plan 1' }),
      generateDoc({ name: 'plan 2' }),
      generateDoc({ name: 'plan 3' }),
      generateDoc({ name: 'plan 4' }),
    ];

    const uniqueLeftThoughtItems: Doc[] = [
      generateDoc({ name: 'thought 5' }),
      generateDoc({ name: 'thought 6' }),
    ];

    const uniqueLeftPlanItems: Doc[] = [
      generateDoc({ name: 'plan 5' }),
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
      generateDoc({ name: 'thought 1' }),
      generateDoc({ name: 'thought 2' }),
      generateDoc({ name: 'thought 3' }),
    ];

    const similarThoughtItems: Doc[] = [
      generateDoc({ name: 'thought 4' }),
      generateDoc({ name: 'thought 5' }),
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

  test(
    `It returns the set differences in deletion docs between left and right 
    side, using itemId as comparator, not deletion id. It only returns
    deletions where item exists on other side. It does not return addables 
    where deletion exists`, () => {
    const thought1Id = uuidv4();
    const thought2Id = uuidv4();
    const thought3Id = uuidv4();
    const thought4Id = uuidv4();
    const thought5Id = uuidv4();
    
    const sharedDeletionItems: Doc[] = [
      generateDoc({ collectionName: 'thought', itemId: thought1Id }),
      generateDoc({ collectionName: 'thought', itemId: thought2Id }),
      generateDoc({ collectionName: 'thought', itemId: uuidv4() }),
      generateDoc({ collectionName: 'thought', itemId: uuidv4() }),
      generateDoc({ collectionName: 'thought', itemId: uuidv4() }),
      generateDoc({ collectionName: 'thought', itemId: uuidv4() }),
    ];

    const uniqueLeftDeletionItems: Doc[] = [
      generateDoc({ collectionName: 'thought', itemId: thought3Id }),
      generateDoc({ collectionName: 'thought', itemId: thought4Id }),
      generateDoc({ collectionName: 'thought', itemId: uuidv4() }),
    ];

    const uniqueRightDeletionItems: Doc[] = [
      generateDoc({ collectionName: 'thought', itemId: thought5Id }),
      generateDoc({ collectionName: 'thought', itemId: uuidv4() }),
    ];

    const leftThoughts: Doc[] = [
      generateDoc({ id: thought5Id }),
      generateDoc({ id: uuidv4() }),
      generateDoc({ id: uuidv4() }),
    ];

    const rightThoughts: Doc[] = [
      generateDoc({ id: thought3Id }),
      generateDoc({ id: thought4Id }),
      generateDoc({ id: uuidv4() }),
      generateDoc({ id: uuidv4() }),
      generateDoc({ id: uuidv4() }),
    ];

    const left: Dump = {
      collections: [
        generateCollection('deletion', [
          ...sharedDeletionItems,
          ...uniqueLeftDeletionItems,
        ]),
        generateCollection('thought', [
          ...leftThoughts,
        ]),
      ],
    };
  
    const right: Dump = {
      collections: [
        generateCollection('deletion', [
          ...sharedDeletionItems,
          ...uniqueRightDeletionItems,
        ]),
        generateCollection('thought', [
          ...rightThoughts,
        ]),
      ],
    };

    const { itemsToAdd, removables }: MergeResults = merge(left, right);
    //5 items - 2 corresponding deletions
    expect(itemsToAdd).toHaveLength(3);
    expect(removables).toHaveLength(1);
    expect(
      removables.map(([deletionItem]) => deletionItem).includes(uniqueRightDeletionItems[0] as any)
    ).toBe(true);
  });
});
