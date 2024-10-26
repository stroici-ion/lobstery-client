import { TLayout } from '../../../../../models/media-tools/images-auto-order';

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
