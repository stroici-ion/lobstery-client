import { IFilterListItem } from '../components/Filter';
import {
  blackAndWhiteCoolFilter,
  blackAndWhiteFilter,
  blackAndWhiteHighContrastFilter,
  blackAndWhiteWarmFilter,
  burnFilter,
  calmFilter,
  coolLightFilter,
  dramaticCoolFilter,
  filmFilter,
  goldenFilter,
  punchFilter,
  radiateFilter,
  vintageFilter,
  vividCoolFilter,
  warmContrastFilter,
} from '../imageDataFunctions/filters';

export const filtersList: IFilterListItem[] = [
  {
    id: 0,
    title: 'Original',
  },
  {
    id: 1,
    title: 'Puch',
    filter: punchFilter,
  },
  {
    id: 2,
    title: 'Golden',
    filter: goldenFilter,
  },
  {
    id: 3,
    title: 'Radiate',
    filter: radiateFilter,
  },
  {
    id: 4,
    title: 'Warm Contrast',
    filter: warmContrastFilter,
  },
  {
    id: 5,
    title: 'Calm',
    filter: calmFilter,
  },
  {
    id: 6,
    title: 'Cool Light',
    filter: coolLightFilter,
  },
  {
    id: 7,
    title: 'Vivid Cool',
    filter: vividCoolFilter,
  },
  {
    id: 8,
    title: 'Dramatic Cool',
    filter: dramaticCoolFilter,
  },
  {
    id: 9,
    title: 'B&W',
    filter: blackAndWhiteFilter,
  },
  {
    id: 10,
    title: 'B&W Cool',
    filter: blackAndWhiteCoolFilter,
  },
  {
    id: 11,
    title: 'B&W Warm',
    filter: blackAndWhiteWarmFilter,
  },
  {
    id: 12,
    title: 'B&W High Contrast',
    filter: blackAndWhiteHighContrastFilter,
  },
  {
    id: 13,
    title: 'Burn',
    filter: burnFilter,
  },
  {
    id: 14,
    title: 'Film',
    filter: filmFilter,
  },
  {
    id: 15,
    title: 'Vintage',
    filter: vintageFilter,
  },
];
