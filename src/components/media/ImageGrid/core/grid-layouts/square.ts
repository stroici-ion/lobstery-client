import { TLayout } from '../../types';

const mainType = 'S';

export const squareLayouts: TLayout[] = [
  {
    mainType,
    requiredTypes: ['T'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [{ type: 'M' }, { type: 'T' }],
        },
      ],
    },
  },
  {
    mainType,
    requiredTypes: [],
    cell: {
      isVertical: true,
      cells: [
        {
          type: 'M',
        },
      ],
    },
  },
];
