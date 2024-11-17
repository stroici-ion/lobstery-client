import { TLayout } from '../../types';

const mainType = 'TU';

export const thinUltraLayouts: TLayout[] = [
  {
    mainType,
    requiredTypes: ['S', 'S'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [
            {
              type: 'S',
            },
            {
              type: 'M',
            },
            {
              type: 'S',
            },
          ],
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
