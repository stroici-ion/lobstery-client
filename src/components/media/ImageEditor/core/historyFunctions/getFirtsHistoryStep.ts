import { EAspectRatios } from '../../types/enums';
import { ICropHistory } from '../../types/interfaces';

export function getFirtsHistoryStep(width: number, height: number, originalAspectRatio?: number): ICropHistory {
  const ar = width / height;
  let cropAR = ar;
  let relativeDimensions = {
    cropWidth: 1,
    cropHeight: 1,
  };

  if (originalAspectRatio) {
    const getRelativeDimensions = (aspectRatio1: number, aspectRatio2: number) => {
      if (aspectRatio1 > aspectRatio2) {
        return {
          cropWidth: aspectRatio2 / aspectRatio1,
          cropHeight: 1,
        };
      } else {
        return {
          cropWidth: 1,
          cropHeight: aspectRatio1 / aspectRatio2,
        };
      }
    };
    cropAR = originalAspectRatio;
    relativeDimensions = getRelativeDimensions(ar, originalAspectRatio);
    console.log(relativeDimensions);
  }

  return {
    flipped: {
      vertical: false,
      horizontal: false,
    },
    rotated: 0,
    angle: 0,
    cropARId: originalAspectRatio ? EAspectRatios.original : EAspectRatios.free,
    cropAR: cropAR,
    imageAR: ar,
    cropLeft: 0.5,
    cropTop: 0.5,
    ...relativeDimensions,
  };
}
