import { Layout } from '../autoOrderImages';

export const thinLayouts: Layout[] = [
  {
    mainType: 'T',
    requiredTypes: ['T', 'T', 'T'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [{ type: 'M' }, { type: 'T' }, { type: 'T' }, { type: 'T' }],
        },
        {
          type: 'R',
        },
      ],
    },
  },
  {
    mainType: 'T',
    requiredTypes: ['S', 'S', 'S', 'S'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [
            { type: 'M' },
            { isVertical: true, cells: [{ type: 'S' }, { type: 'S' }] },
            { isVertical: true, cells: [{ type: 'S' }, { type: 'S' }] },
          ],
        },
        {
          type: 'R',
        },
      ],
    },
  },
  {
    mainType: 'T',
    requiredTypes: ['S', 'S'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [{ type: 'M' }, { type: 'S' }, { type: 'S' }],
        },
        {
          type: 'R',
        },
      ],
    },
  },
];
