import { IImage } from '../../../redux/images/types';

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

export type TGridCell = {
  imageId: number;
  orderId: number;
  key: string;
  imageSrc: string;
  video?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  styles: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
  ar: number;
  direction: boolean;
  cells: TGridCell[];
};
