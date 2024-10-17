import { Layout } from '../autoOrderImages';

export const wideLayouts: Layout[] = [
  {
    mainType: 'W',
    requiredTypes: ['T', 'T'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [{ type: 'T' }, { type: 'T' }, { type: 'M' }],
        },
        {
          type: 'R',
        },
      ],
    },
  },
  {
    mainType: 'W',
    requiredTypes: ['T'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [
            { type: 'M' },
            {
              isVertical: true,
              cells: [{ type: 'T' }],
            },
          ],
        },
        {
          type: 'R',
        },
      ],
    },
  },
  {
    mainType: 'W',
    requiredTypes: ['T'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [
            {
              isVertical: true,
              cells: [{ type: 'T' }],
            },
            { type: 'M' },
          ],
        },
        {
          type: 'R',
        },
      ],
    },
  },

  {
    mainType: 'W',
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
        {
          type: 'R',
        },
      ],
    },
  },
  {
    mainType: 'W',
    requiredTypes: ['S', 'S'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [
            {
              isVertical: true,
              cells: [{ type: 'S' }, { type: 'S' }],
            },
            { type: 'M' },
          ],
        },
        {
          type: 'R',
        },
      ],
    },
  },
];
