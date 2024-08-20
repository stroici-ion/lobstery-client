import { calculateDiagonalLength, calculateHelperAngle } from '../maxDistance/cropRotatedDistToImage';
import { degrees_to_radians } from '../../../../../calculationFunctions/converters';
import { IImageShape, IPosition } from '../../../../../types/interfaces';
import { getDistanceToCenter } from '../maxDistance/distToCenter';
import { getRotatedShape } from './getRotatedShape';

export const getImageOuterPosition = (O: IPosition, image: IImageShape) => {
  const outerImageDimensions = getRotatedShape(image, image.angle);
  const imageDists = getDistanceToCenter(image, O);
  let distLeft = 0;
  let distTop = 0;
  if (image.angle > 0) {
    const ipY = calculateDiagonalLength(imageDists.left, imageDists.top);
    const helperAngleY = calculateHelperAngle(imageDists.top, ipY) - image.angle;

    const ipX = calculateDiagonalLength(imageDists.left, imageDists.bottom);
    const helperAngleX = calculateHelperAngle(imageDists.left, ipX) - image.angle;

    distTop = ipY * Math.cos(degrees_to_radians(helperAngleY));
    distLeft = ipX * Math.cos(degrees_to_radians(helperAngleX));
  } else {
    const ipX = calculateDiagonalLength(imageDists.left, imageDists.top);
    const helperAngleX = calculateHelperAngle(imageDists.left, ipX) + image.angle;

    const ipY = calculateDiagonalLength(imageDists.top, imageDists.right);
    const helperAngleY = calculateHelperAngle(imageDists.top, ipY) + image.angle;

    distTop = ipY * Math.cos(degrees_to_radians(helperAngleY));
    distLeft = ipX * Math.cos(degrees_to_radians(helperAngleX));
  }

  const outer = {
    ratio: (Math.cos(degrees_to_radians(90 - image.angle)) * image.height) / outerImageDimensions.width,
    x: O.x - distLeft,
    y: O.y - distTop,
    width: outerImageDimensions.width,
    height: outerImageDimensions.height,
  };
  return {
    ...outer,
    startPosition: {
      ...outer,
    },
  };
};
