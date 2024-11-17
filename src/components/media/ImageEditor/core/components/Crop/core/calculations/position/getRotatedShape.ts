import { convertToRadians } from '../../../../../calculationFunctions/converters';
import { IDimension } from '../../../../../../types/interfaces';

export const getRotatedShape = (dimension: IDimension, angle: number) => {
  const a = Math.abs(angle);
  const cos = Math.cos(convertToRadians(a));
  const sin = Math.sin(convertToRadians(a));

  return {
    width: cos * dimension.width + sin * dimension.height,
    height: cos * dimension.height + sin * dimension.width,
  };
};
