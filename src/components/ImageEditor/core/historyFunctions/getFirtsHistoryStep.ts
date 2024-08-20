import { EnumAspectRatios } from '../types/enumerations';
import { ICropHistory } from '../types/interfaces';

export function getFirtsHistoryStep(width: number, height: number): ICropHistory {
  const ar = width / height;
  return {
    flipped: {
      vertical: false,
      horizontal: false,
    },
    rotated: 0,
    angle: 0,
    cropARId: EnumAspectRatios.free,
    cropAR: ar,
    imageAR: ar,
    cropLeft: 0.5,
    cropTop: 0.5,
    cropWidth: 1,
    cropHeight: 1,
  };
}
