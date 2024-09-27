import { IAdjustments } from '../types/interfaces';

export const compareAdjustments = (a: IAdjustments, b: IAdjustments) => {
  return (
    a.brightness === b.brightness &&
    a.contrast === b.contrast &&
    a.saturation === b.saturation &&
    a.warmth === b.warmth &&
    a.tint === b.tint &&
    a.sharpness === b.sharpness &&
    a.exposure === b.exposure &&
    a.highlights === b.highlights &&
    a.shadows === b.shadows
  );
};
