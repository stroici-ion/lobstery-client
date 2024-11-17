import { TLayout } from '../../types';

const mainType = 'T';

export const thinLayouts: TLayout[] = [
  {
    mainType,
    requiredTypes: ['T', 'T', 'T', 'T'],
    onlyRequired: true,
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [{ type: 'M' }, { type: 'T' }],
        },
        {
          cells: [{ type: 'T' }, { type: 'T' }, { type: 'T' }],
        },
      ],
    },
  },
  {
    mainType,
    requiredTypes: ['T', 'T', 'T', 'T', 'T'],
    onlyRequired: true,
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [{ type: 'M' }, { type: 'T' }, { type: 'T' }],
        },
        {
          cells: [{ type: 'T' }, { type: 'T' }, { type: 'T' }],
        },
      ],
    },
  },
  {
    mainType,
    requiredTypes: ['T', 'T', 'T', 'T', 'T', 'T'],
    onlyRequired: true,
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [{ type: 'M' }, { type: 'T' }, { type: 'T' }],
        },
        {
          cells: [{ type: 'T' }, { type: 'T' }, { type: 'T' }, { type: 'T' }],
        },
      ],
    },
  },
  {
    mainType,
    requiredTypes: ['T', 'T', 'T', 'T', 'T', 'T'],
    onlyRequired: true,
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [{ type: 'M' }, { type: 'T' }, { type: 'T' }],
        },
        {
          cells: [{ type: 'T' }, { type: 'T' }, { type: 'T' }, { type: 'T' }],
        },
      ],
    },
  },
  {
    mainType,
    requiredTypes: ['S', 'S', 'S', 'S'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [
            { isVertical: true, cells: [{ type: 'S' }, { type: 'S' }] },
            { type: 'M' },
            { isVertical: true, cells: [{ type: 'S' }, { type: 'S' }] },
          ],
        },
      ],
    },
  },
  {
    mainType,
    requiredTypes: ['S', 'S', 'S', 'S'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [
            { type: 'M' },
            {
              isVertical: true,
              cells: [
                { isVertical: true, cells: [{ type: 'S' }] },
                { cells: [{ type: 'S' }, { type: 'S' }, { type: 'S' }] },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    mainType,
    requiredTypes: ['T', 'T', 'T'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [{ type: 'M' }, { type: 'T' }, { type: 'T' }, { type: 'T' }],
        },
      ],
    },
  },
  {
    mainType,
    requiredTypes: ['T', 'T'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [{ type: 'M' }, { type: 'T' }, { type: 'T' }],
        },
      ],
    },
  },
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
    requiredTypes: ['S', 'S'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [{ type: 'M' }, { type: 'S' }, { type: 'S' }],
        },
      ],
    },
  },
  {
    mainType,
    requiredTypes: ['W', 'W'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [{ type: 'M' }, { isVertical: true, cells: [{ type: 'W' }, { type: 'W' }] }],
        },
      ],
    },
  },
  {
    mainType,
    requiredTypes: ['W'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [{ type: 'M' }, { type: 'W' }],
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
