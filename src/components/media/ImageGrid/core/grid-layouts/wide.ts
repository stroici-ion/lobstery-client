import { TLayout } from '../../../../../models/media-tools/images-auto-order';
const mainType = 'W';

export const wideLayouts: TLayout[] = [
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
