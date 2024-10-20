import { IImage } from '../IImage';

export type TRemainedImagesLocation = 'top' | 'right' | 'bottom' | 'left';

export type TImageArType = 'WU' | 'W' | 'S' | 'T' | 'TU';

export type TMIImage = IImage & {
  arType: TImageArType;
};

export type TImagesTypes = {
  WU: TMIImage[];
  W: TMIImage[];
  S: TMIImage[];
  T: TMIImage[];
  TU: TMIImage[];
};

export type TCell = {
  isVertical?: boolean;
  type?: TImageArType | 'R' | 'M';
  cells?: TCell[];
};

export type TLayout = {
  onlyRequired?: boolean;
  cell: TCell;
  mainType: TImageArType;
  requiredTypes: TImageArType[];
};
