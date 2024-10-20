import { TLayout } from '../../../../../models/media-tools/images-auto-order';
const mainType = 'W';

export const wideLayouts: TLayout[] = [
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
    requiredTypes: ['T'],
    cell: {
      isVertical: true,
      cells: [
        {
          cells: [{ type: 'T' }, { type: 'M' }],
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
