import { getDistanceToRotatedAxis } from '../../../../calculationFunctions/distances';
import { IImageShape, IPosition } from '../../../../Types/Interfaces';

export const getRelativePoint = (p: IPosition, O: IPosition, image: IImageShape, image_O: IPosition) => {
  let relativePoint = {
    ...p,
  };

  if (image.angle) {
    const point_O = {
      x: p.x - O.x,
      y: p.y - O.y,
    };

    const point_OR = getDistanceToRotatedAxis(point_O, image.angle);
    const point_IR = {
      x: image_O.x + point_OR.x,
      y: image_O.y + point_OR.y,
    };

    relativePoint = {
      x: point_IR.x / image.width,
      y: point_IR.y / image.height,
    };
  } else {
    const point_O = {
      x: p.x - O.x,
      y: p.y - O.y,
    };

    const point_I = {
      x: image_O.x + point_O.x,
      y: image_O.y + point_O.y,
    };

    relativePoint = {
      x: point_I.x / image.width,
      y: point_I.y / image.height,
    };
  }

  const result = {
    ...relativePoint,
  };

  switch (image.rotated) {
    case 0: {
      if (image.flipped.horizontal) {
        result.x = 1 - result.x;
      }
      if (image.flipped.vertical) {
        result.y = 1 - result.y;
      }
      break;
    }
    case 1: {
      result.y = 1 - relativePoint.x;
      result.x = relativePoint.y;
      if (image.flipped.horizontal) {
        result.y = 1 - result.y;
      }
      if (image.flipped.vertical) {
        result.x = 1 - result.x;
      }
      break;
    }
    case 2: {
      result.y = 1 - relativePoint.y;
      result.x = 1 - relativePoint.x;
      if (image.flipped.horizontal) {
        result.x = 1 - result.x;
      }
      if (image.flipped.vertical) {
        result.y = 1 - result.y;
      }
      break;
    }
    case 3: {
      result.y = relativePoint.x;
      result.x = 1 - relativePoint.y;
      if (image.flipped.horizontal) {
        result.y = 1 - result.y;
      }
      if (image.flipped.vertical) {
        result.x = 1 - result.x;
      }
      break;
    }
  }
  return result;
};
