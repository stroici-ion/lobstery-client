import { getDistanceToRotatedAxis } from '../../../../../calculationFunctions/distances';
import { degrees_to_radians } from '../../../../../calculationFunctions/converters';
import { IPosition, IShape } from '../../../../../Types/Interfaces';

export const getInscriptedImage = (outerImage: IShape, angle: number, aspectRatio: number, ratio: number, Origin: IPosition) => {
  const relSize = outerImage.width * ratio;
  const sin = Math.sin(degrees_to_radians(angle));
  const height = relSize / sin;
  const width = height * aspectRatio;
  const x = Origin.x - (outerImage.x + outerImage.width / 2);
  const y = Origin.y - (outerImage.y + outerImage.height / 2);
  const iDistancToRIaxis = getDistanceToRotatedAxis({ x, y }, angle);

  const result = {
    x: Origin.x - (width / 2 + iDistancToRIaxis.x),
    y: Origin.y - (height / 2 + iDistancToRIaxis.y),
    width: width,
    height: height,
  };

  return result;
};
