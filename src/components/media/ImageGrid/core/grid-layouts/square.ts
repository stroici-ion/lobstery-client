import { Layout } from '../autoOrderImages';

export const squareLayouts: Layout[] = [
  {
    mainType: 'S',
    requiredTypes: ['T'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [{ type: 'M' }, { type: 'T' }],
        },
        {
          type: 'R',
        },
      ],
    },
  },
];
