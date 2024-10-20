import { TLayout } from '../../../../../models/media-tools/images-auto-order';

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
