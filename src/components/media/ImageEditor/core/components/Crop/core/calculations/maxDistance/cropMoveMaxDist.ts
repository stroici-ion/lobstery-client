import {
  IBorders,
  ICropShape,
  IDynamicShape,
  IImageShape,
  IPosition,
  IShape,
} from '../../../../../../types/interfaces';
import { getAvailableResizeDirection } from '../../mouseMoveType/getAvailableDirection';
import { convertToRadians } from '../../../../../calculationFunctions/converters';
import { resizeBottomFreeOverView } from '../resizeCrop/directions/bottomFree';
import { resizeRightFreeOverView } from '../resizeCrop/directions/rightFree';
import { resizeLeftFreeOverView } from '../resizeCrop/directions/leftFree';
import { resizeTopFreeOverView } from '../resizeCrop/directions/topFree';
import { resizeBottomOverView } from '../resizeCrop/directions/bottom';
import { resizeRightOverView } from '../resizeCrop/directions/right';
import { getCropRotatedDistToImage } from './cropRotatedDistToImage';
import { getInscriptedImage } from '../position/getInscriptedImage';
import { resizeLeftOverView } from '../resizeCrop/directions/left';
import { EMoveTypes } from '../../../../../../types/enums';
import { resizeTopOverView } from '../resizeCrop/directions/top';
import { getRotatedShape } from '../position/getRotatedShape';
import { iEBSB, iEBSLR, iEBST } from '../../../../../config';
import { getDistanceToCenter } from './distToCenter';

export const getCropMaxDistanceToBorders = (crop: ICropShape, parentSize: { width: number; height: number }) => {
  const max: IBorders = {
    left: crop.x - iEBSLR,
    top: crop.y - iEBST,
    right: parentSize.width - iEBSLR - crop.x - crop.width,
    bottom: parentSize.height - iEBSB - crop.y - crop.height,
  };
  return max;
};

export const getImageLimits = (crop: IShape, image: IShape) => {
  const max: IBorders = {
    left: crop.x - image.x,
    top: crop.y - image.y,
    right: image.x + image.width - crop.x - crop.width,
    bottom: image.y + image.height - crop.y - crop.height,
  };

  return max;
};

export const getRotatedImageLimits = (
  crop: ICropShape,
  image: IImageShape,
  O: IPosition,
  moveType: EMoveTypes,
  viewBorders: IBorders
) => {
  const newCrop = {
    ...crop,
    startPosition: {
      ...crop.startPosition,
    },
  };

  const newImage = {
    ...image.outerImage,
    startPosition: {
      ...image.outerImage.startPosition,
    },
  };

  const overBorderRatio = {
    left: 100,
    right: 100,
    top: 100,
    bottom: 100,
  };

  const a = Math.abs(image.angle);
  const cos = Math.cos(convertToRadians(a));
  const sin = Math.sin(convertToRadians(a));
  const imageDC = getDistanceToCenter(image, O);

  const cropRotated = getRotatedShape(crop, image.angle);
  const dist: IBorders = getCropRotatedDistToImage(cropRotated, imageDC);
  const distOuter: IBorders = getImageLimits(crop, image.outerImage);

  switch (moveType) {
    case EMoveTypes.top:
      if (crop.aspectRatio) {
        let border: 'left' | 'top' | 'right' | undefined;
        if (image.angle) {
          const availableDirection = getAvailableResizeDirection(image.angle, dist);
          switch (availableDirection) {
            case EMoveTypes.leftTop:
              border = 'left';
              break;
            case EMoveTypes.rightTop:
              border = 'right';
              break;
            case EMoveTypes.default:
              border = 'top';
          }
        }
        if (border) {
          const isCrossingTopDirection = (progress: number) => {
            switch (border) {
              case 'left':
                resizeLeftOverView(progress, EMoveTypes.leftTop, newImage, newCrop, distOuter);
                break;
              case 'right':
                resizeRightOverView(progress, EMoveTypes.rightTop, newImage, newCrop, distOuter);
                break;
              default:
                resizeTopOverView(progress, newImage, newCrop, distOuter);
            }

            return isCrossingBorders(newCrop, newImage, image, O);
          };
          overBorderRatio[border] = getRatioPrecision(isCrossingTopDirection);
        } else overBorderRatio.top = 0;
      } else {
        const overSide = (image.angle < 0 ? dist.right : dist.left) / sin;
        dist.top = dist.top / cos;
        if (dist.top > overSide) dist.top = overSide;

        if (viewBorders.top * 2 < dist.top) {
          const isCrossingTopDirection = (progress: number) => {
            resizeTopFreeOverView(progress, newImage, newCrop, viewBorders);
            return isCrossingBorders(newCrop, newImage, image, O);
          };
          overBorderRatio.top = getRatioPrecision(isCrossingTopDirection);
        }
      }
      break;
    case EMoveTypes.bottom:
      if (crop.aspectRatio) {
        let border: 'left' | 'bottom' | 'right' | undefined;
        if (image.angle) {
          const availableDirection = getAvailableResizeDirection(image.angle, dist);
          switch (availableDirection) {
            case EMoveTypes.leftBottom:
              border = 'left';
              break;
            case EMoveTypes.rightBottom:
              border = 'right';
              break;
            case EMoveTypes.default:
              border = 'bottom';
          }
        }
        if (border) {
          const isCrossingBottomDirection = (progress: number) => {
            switch (border) {
              case 'left':
                resizeLeftOverView(progress, EMoveTypes.leftBottom, newImage, newCrop, distOuter);
                break;
              case 'right':
                resizeRightOverView(progress, EMoveTypes.rightBottom, newImage, newCrop, distOuter);
                break;
              default:
                resizeBottomOverView(progress, newImage, newCrop, distOuter);
            }
            return isCrossingBorders(newCrop, newImage, image, O);
          };
          overBorderRatio[border] = getRatioPrecision(isCrossingBottomDirection);
        } else overBorderRatio.bottom = 0;
      } else {
        const overSide = (image.angle < 0 ? dist.left : dist.right) / sin;
        dist.bottom = dist.bottom / cos;
        if (dist.bottom > overSide) dist.bottom = overSide;
        if (viewBorders.bottom * 2 < dist.bottom) {
          const isCrossingBottomDirection = (progress: number) => {
            resizeBottomFreeOverView(progress, newImage, newCrop, viewBorders);
            return isCrossingBorders(newCrop, newImage, image, O);
          };
          overBorderRatio.bottom = getRatioPrecision(isCrossingBottomDirection);
        }
      }
      break;
    case EMoveTypes.left:
    case EMoveTypes.leftTop:
    case EMoveTypes.leftBottom:
      if (crop.aspectRatio) {
        let mooveRedirect = moveType;

        let availableDirection = getAvailableResizeDirection(image.angle, dist);

        if (moveType === EMoveTypes.leftTop || moveType === EMoveTypes.leftBottom) {
          if (availableDirection !== moveType && availableDirection !== EMoveTypes.default)
            availableDirection = undefined;
        } else
          switch (availableDirection) {
            case EMoveTypes.leftTop:
            case EMoveTypes.leftBottom:
              mooveRedirect = availableDirection;
          }

        if (availableDirection) {
          const isCrossingLeftDirection = (progress: number) => {
            resizeLeftOverView(progress, mooveRedirect, newImage, newCrop, distOuter);
            return isCrossingBorders(newCrop, newImage, image, O);
          };
          overBorderRatio.left = getRatioPrecision(isCrossingLeftDirection);
        } else overBorderRatio.left = 0;
      } else {
        const overSide = (image.angle < 0 ? dist.top : dist.bottom) / sin;
        dist.left = dist.left / cos;
        if (dist.left > overSide) dist.left = overSide;
        if (viewBorders.left * 2 < dist.left) {
          const isCrossingLeftDirection = (progress: number) => {
            resizeLeftFreeOverView(progress, newImage, newCrop, viewBorders);
            return isCrossingBorders(newCrop, newImage, image, O);
          };
          overBorderRatio.left = getRatioPrecision(isCrossingLeftDirection);
        }
      }
      break;
    case EMoveTypes.right:
    case EMoveTypes.rightTop:
    case EMoveTypes.rightBottom:
      if (crop.aspectRatio) {
        let mooveRedirect = moveType;

        let availableDirection = getAvailableResizeDirection(image.angle, dist);
        if (moveType === EMoveTypes.rightTop || moveType === EMoveTypes.rightBottom) {
          if (availableDirection !== moveType && availableDirection !== EMoveTypes.default)
            availableDirection = undefined;
        } else
          switch (availableDirection) {
            case EMoveTypes.rightTop:
            case EMoveTypes.rightBottom:
              mooveRedirect = availableDirection;
          }

        if (availableDirection) {
          const isCrossingRightDirection = (progress: number) => {
            resizeRightOverView(progress, mooveRedirect, newImage, newCrop, distOuter);
            return isCrossingBorders(newCrop, newImage, image, O);
          };
          overBorderRatio.right = getRatioPrecision(isCrossingRightDirection);
        } else overBorderRatio.right = 0;
      } else {
        const overSide = (image.angle < 0 ? dist.bottom : dist.top) / sin;
        dist.right = dist.right / cos;
        if (dist.right > overSide) dist.right = overSide;

        if (viewBorders.right * 2 < dist.right) {
          const isCrossingRightDirection = (progress: number) => {
            resizeRightFreeOverView(progress, newImage, newCrop, viewBorders);
            return isCrossingBorders(newCrop, newImage, image, O);
          };
          overBorderRatio.right = getRatioPrecision(isCrossingRightDirection);
        }
      }
      break;
  }

  return { image: dist, overBorderRatio: overBorderRatio };
};

const isCrossingBorders = (newCrop: IDynamicShape, newImage: IDynamicShape, image: IImageShape, O: IPosition) => {
  const inscriptedImage = getInscriptedImage(newImage, image.angle, image.aspectRatio, image.outerImage.ratio, O);
  const newCropOuter = getRotatedShape(newCrop, image.angle);
  const newImageDC = getDistanceToCenter(inscriptedImage, O);
  const maxDistY = newCropOuter.height / 2;
  const maxDistX = newCropOuter.width / 2;
  if (maxDistY >= newImageDC.bottom) return true;
  else if (maxDistY >= newImageDC.top) return true;
  else if (maxDistX >= newImageDC.left) return true;
  else if (maxDistX >= newImageDC.right) return true;
  return false;
};

const getRatioPrecision = (callback: (progress: number) => boolean) => {
  for (let i = 20; i <= 100; i += 20) {
    if (callback(i)) {
      i -= 20;
      for (let j = 5; j <= 25; j += 5) {
        if (callback(i + j)) {
          j -= 5;
          for (let k = 1; k <= 5; k++) {
            if (callback(i + j + k)) {
              k -= 1;
              for (let l = 0.1; l <= 1; l += 0.1) {
                if (callback(i + j + k + l)) {
                  l -= 0.1;
                  for (let m = 0.01; m <= 1; m += 0.01) {
                    if (callback(i + j + k + l + m)) {
                      return i + j + k + l + m - 0.01;
                    }
                  }
                  break;
                }
              }
              break;
            }
          }
          break;
        }
      }
      break;
    }
  }
  return 100;
};
