import { TLayout } from '../../../../../models/media-tools/images-auto-order';

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
        {
          type: 'R',
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
          cells: [{ type: 'T' }, { type: 'M' }],
        },
        {
          type: 'R',
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
        {
          type: 'R',
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
  {
    mainType,
    requiredTypes: [],
    cell: {
      isVertical: true,
      cells: [
        {
          type: 'M',
        },
        {
          type: 'R',
        },
      ],
    },
  },
];
