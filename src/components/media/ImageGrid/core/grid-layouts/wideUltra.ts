import { TLayout } from '../../types';

const mainType = 'WU';

export const wideUltra: TLayout[] = [
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
    requiredTypes: ['T', 'T'],
    onlyRequired: true,
    cell: {
      isVertical: true,
      cells: [
        {
          type: 'M',
        },
        {
          cells: [{ type: 'T' }, { type: 'T' }],
        },
      ],
    },
  },
  {
    mainType,
    requiredTypes: ['S', 'S'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [
            { type: 'M' },
            {
              isVertical: true,
              cells: [{ type: 'S' }, { type: 'S' }],
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
