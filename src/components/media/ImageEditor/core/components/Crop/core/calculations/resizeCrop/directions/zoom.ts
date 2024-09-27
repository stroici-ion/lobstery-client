import {
  calculateDiagonalLength,
  calculateHelperAngle,
  getCropRotatedDistToImage,
} from '../../maxDistance/cropRotatedDistToImage';
import { ICropShape, IDynamicShape, IImageShape } from '../../../../../../types/interfaces';
import { getImageLimits, getRotatedImageLimits } from '../../maxDistance/cropMoveMaxDist';
import { degrees_to_radians } from '../../../../../../calculationFunctions/converters';
import { EnumMoveTypes } from '../../../../../../types/enumerations';
import { getDistanceToCenter } from '../../maxDistance/distToCenter';
import { getRotatedShape } from '../../position/getRotatedShape';
import { TZoomProperties } from '../../../../../../types/types';
import { iEZPS } from '../../../../../../config';

export const zoomOut = (
  crop: ICropShape,
  image: IDynamicShape & { angle: number },
  stepProperties: TZoomProperties
) => {
  const ar = image.startPosition.width / image.startPosition.height;

  const O = {
    x: crop.x + crop.width / 2,
    y: crop.y + crop.height / 2,
  };

  const minX = {
    value: 0,
    type: EnumMoveTypes.default,
  };

  const minY = {
    value: 0,
    type: EnumMoveTypes.default,
  };

  const min = {
    value: 0,
    type: EnumMoveTypes.default,
  };

  const startImageDC = getDistanceToCenter(image.startPosition, O);
  const rotatedCrop = getRotatedShape(crop, image.angle);
  const startImageLimits = image.angle
    ? getCropRotatedDistToImage(rotatedCrop, startImageDC)
    : getImageLimits(crop, image.startPosition);

  minX.type = EnumMoveTypes[startImageLimits.left < startImageLimits.right ? 'left' : 'right'];
  minX.value = startImageLimits[startImageLimits.left < startImageLimits.right ? 'left' : 'right'];

  minY.type = EnumMoveTypes[startImageLimits.top < startImageLimits.bottom ? 'top' : 'bottom'];
  minY.value = startImageLimits[startImageLimits.top < startImageLimits.bottom ? 'top' : 'bottom'];

  const cropAr = image.angle ? 1 : crop.width / crop.height;

  if (minX.value < minY.value * cropAr) {
    min.type = minX.type;
    min.value = minX.value;
  } else {
    min.type = minY.type;
    min.value = minY.value;
  }

  const relX = (O.x - image.startPosition.x) / image.startPosition.width;
  const relY = (O.y - image.startPosition.y) / image.startPosition.height;

  let relWidth = (crop.width / 2 + iEZPS) / image.startPosition.width;

  image.width = crop.width / 2 / relWidth;
  image.height = image.width / ar;

  image.x = O.x - image.width * relX;
  image.y = O.y - image.height * relY;

  const imageLimits = image.angle
    ? getCropRotatedDistToImage(rotatedCrop, getDistanceToCenter(image, O))
    : getImageLimits(crop, image);

  const noIntersected =
    imageLimits.top >= 0 && imageLimits.right >= 0 && imageLimits.bottom >= 0 && imageLimits.left >= 0;

  if (!noIntersected) {
    if (image.angle) {
      if (image.angle > 0) {
        switch (min.type) {
          case EnumMoveTypes.top:
            stepProperties.direction = EnumMoveTypes.leftBottom;
            break;
          case EnumMoveTypes.right:
            stepProperties.direction = EnumMoveTypes.leftTop;
            break;
          case EnumMoveTypes.bottom:
            stepProperties.direction = EnumMoveTypes.rightTop;
            break;
          default:
            stepProperties.direction = EnumMoveTypes.rightBottom;
        }
      } else {
        switch (min.type) {
          case EnumMoveTypes.top:
            stepProperties.direction = EnumMoveTypes.rightBottom;
            break;
          case EnumMoveTypes.right:
            stepProperties.direction = EnumMoveTypes.leftBottom;
            break;
          case EnumMoveTypes.bottom:
            stepProperties.direction = EnumMoveTypes.leftTop;
            break;
          default:
            stepProperties.direction = EnumMoveTypes.rightTop;
        }
      }
    } else stepProperties.direction = min.type;

    stepProperties.isStartPosition = true;

    const imageRelDC = {
      top: startImageDC.top / image.startPosition.height,
      right: startImageDC.right / image.startPosition.width,
      bottom: startImageDC.bottom / image.startPosition.height,
      left: startImageDC.left / image.startPosition.width,
    };

    const isX = min.type === EnumMoveTypes.left || min.type === EnumMoveTypes.right;

    let dist = 0;
    let distRel = 0;
    let opositeRel = 0;

    switch (min.type) {
      case EnumMoveTypes.top:
        dist = startImageLimits.top;
        distRel = imageRelDC.top;
        opositeRel = imageRelDC.bottom;
        break;
      case EnumMoveTypes.right:
        dist = startImageLimits.right;
        distRel = imageRelDC.right;
        opositeRel = imageRelDC.left;
        break;
      case EnumMoveTypes.bottom:
        dist = startImageLimits.bottom;
        distRel = imageRelDC.bottom;
        opositeRel = imageRelDC.top;
        break;
      case EnumMoveTypes.left:
        dist = startImageLimits.left;
        distRel = imageRelDC.left;
        opositeRel = imageRelDC.right;
        break;
    }

    if (isX) {
      image.width = image.startPosition.width - dist - dist * (opositeRel / distRel);
      image.height = image.width / ar;

      if (min.type === EnumMoveTypes.left) image.x = O.x - image.width * imageRelDC.left;
      else image.x = O.x + image.width * imageRelDC.right - image.width;

      image.y = O.y - image.height * relY;
    } else {
      image.height = image.startPosition.height - dist - dist * (opositeRel / distRel);
      image.width = image.height * ar;

      if (min.type === EnumMoveTypes.top) image.y = O.y - image.height * imageRelDC.top;
      else image.y = O.y + image.height * imageRelDC.bottom - image.height;

      image.x = O.x - image.width * relX;
    }

    if (image.angle) {
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

      stepProperties.outer = {
        ratio: (Math.cos(degrees_to_radians(90 - image.angle)) * image.height) / outerImageDimensions.width,
        x: O.x - distLeft,
        y: O.y - distTop,
        width: outerImageDimensions.width,
        height: outerImageDimensions.height,
      };

      const newImage: IImageShape = {
        rotated: 0,
        cropCenter: {
          x: 0,
          y: 0,
        },
        aspectRatio: image.width / image.height,
        flipped: {
          vertical: false,
          horizontal: false,
        },
        ...image,
        outerImage: {
          ...stepProperties.outer,
          startPosition: {
            ...stepProperties.outer,
          },
        },
      };

      const result = getRotatedImageLimits(crop, newImage, O, stepProperties.direction, {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      });

      stepProperties.maxOverBorderRatio = result.overBorderRatio;
    }
  }
};

// const getName = (x: EnumMoveTypes) => {
//   switch (x) {
//     case EnumMoveTypes.top:
//       return 'Top';
//     case EnumMoveTypes.right:
//       return 'Right';
//     case EnumMoveTypes.bottom:
//       return 'Bottom';
//     case EnumMoveTypes.left:
//       return 'Left';
//   }
//   return 'none';
// };
