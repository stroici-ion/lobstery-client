import { EnumMoveTypes } from './enumerations';
import { IBorders, IShape } from './interfaces';

export type TFlipped = {
  vertical: boolean;
  horizontal: boolean;
};
export type TZoomProperties = {
  maxOverBorderRatio: IBorders;
  stop: boolean;
  direction: EnumMoveTypes;
  isStartPosition: boolean;
  outer: IShape & { ratio: number };
};

export type TZoomStep = IShape & TZoomProperties;
