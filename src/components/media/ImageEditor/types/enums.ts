export enum ETabs {
  crop = 0,
  adjustment = 1,
  filter = 2,
  markup = 3,
}

export enum EMoveTypes {
  default = 1,
  image = 2,
  left = 3,
  right = 4,
  top = 5,
  bottom = 6,
  leftTop = 7,
  rightTop = 8,
  leftBottom = 9,
  rightBottom = 10,
  range = 11,
}

export enum EAspectRatios {
  free = 'AF',
  original = 'AO',
  square = 'A1',
  ratio_9_16 = 'A916',
  ratio_16_9 = 'A169',
  ratio_4_5 = 'A45',
  ratio_5_4 = 'A54',
  ratio_3_4 = 'A34',
  ratio_4_3 = 'A43',
  ratio_2_3 = 'A23',
  ratio_3_2 = 'A32',
  ratio_1_2 = 'A12',
  ratio_2_1 = 'A21',
}

export enum EMarkupBrushTypes {
  freeHand = 1,
  freeHandArrow = 2,
  freeHandDoubleArrow = 3,
  straight = 4,
  straightArrow = 5,
  straightDoubleArrow = 6,
}

export enum EMarkupToolTypes {
  brush = 1,
  erase = 2,
  eraseAll = 3,
  colorPicker = 4,
}
