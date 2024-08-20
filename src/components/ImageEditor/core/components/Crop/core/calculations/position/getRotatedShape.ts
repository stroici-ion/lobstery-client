import { degrees_to_radians } from '../../../../../calculationFunctions/converters';
import { IDimension } from '../../../../../types/interfaces';

export const getRotatedShape = (dimension: IDimension, angle: number) => {
  const a = Math.abs(angle);
  const cos = Math.cos(degrees_to_radians(a));
  const sin = Math.sin(degrees_to_radians(a));

  return {
    width: cos * dimension.width + sin * dimension.height,
    height: cos * dimension.height + sin * dimension.width,
  };
};
