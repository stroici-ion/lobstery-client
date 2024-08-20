import { IAdjustments } from '../Types/Interfaces';

export const checkAdjustments = (a: IAdjustments) => {
  return (
    a.brightness !== 0 ||
    a.contrast !== 0 ||
    a.saturation !== 0 ||
    a.warmth !== 0 ||
    a.tint !== 0 ||
    a.sharpness !== 0 ||
    a.exposure !== 0 ||
    a.highlights !== 0 ||
    a.shadows !== 0
  );
};
