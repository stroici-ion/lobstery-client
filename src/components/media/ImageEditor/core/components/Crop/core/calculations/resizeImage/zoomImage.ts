import {
  IBorders,
  ICropShape,
  IDynamicShape,
  IImageShape,
  IPosition,
  IShape,
} from '../../../../../../types/interfaces';
import { resizeBottomOverView } from '../resizeCrop/directions/bottom';
import { resizeRightOverView } from '../resizeCrop/directions/right';
import { getInscriptedImage } from '../position/getInscriptedImage';
import { resizeLeftOverView } from '../resizeCrop/directions/left';
import { EMoveTypes } from '../../../../../../types/enums';
import { resizeTopOverView } from '../resizeCrop/directions/top';
import { getImageLimits } from '../maxDistance/cropMoveMaxDist';
import { adjustShapePostion } from '../../../../../utils/calc';
import { IZoomProperties } from '../../../../../../types/interfaces';
import { zoomOut } from '../resizeCrop/directions/zoom';
import { iEZPS } from '../../../../../config';

export const zoomImage = (
  step: number,
  isZoomIn: boolean,
  crop: ICropShape,
  image: IImageShape,
  O: IPosition,
  imageDC: IBorders,
  stepProperties: IZoomProperties,
  startPosition?: IShape & { ratio?: number } & {
    maxOverBorderRatio: IBorders;
  }
) => {
  if (stepProperties.direction !== EMoveTypes.default) {
    if (startPosition) {
      const newImage: IDynamicShape & { angle: number } = image.angle
        ? {
            angle: image.angle,
            x: 0,
            y: 0,
            width: 0,
            height: 0, //Needs Outer Image to Work
            startPosition: {
              ...startPosition,
            },
          }
        : {
            ...image,
            startPosition: {
              x: startPosition.x,
              y: startPosition.y,
              width: startPosition.width,
              height: startPosition.height,
            },
          };

      const imageBorders = getImageLimits(crop, startPosition);

      switch (stepProperties.direction) {
        case EMoveTypes.rightTop:
        case EMoveTypes.rightBottom: {
          const progress = (startPosition.maxOverBorderRatio.right / 10) * step;
          resizeRightOverView(progress, stepProperties.direction, newImage, crop, imageBorders);

          break;
        }
        case EMoveTypes.leftTop:
        case EMoveTypes.leftBottom: {
          const progress = (startPosition.maxOverBorderRatio.left / 10) * step;
          resizeLeftOverView(progress, stepProperties.direction, newImage, crop, imageBorders);
          break;
        }
        case EMoveTypes.top:
          resizeBottomOverView(step * 10, newImage, crop, imageBorders);
          break;
        case EMoveTypes.right:
          resizeLeftOverView(step * 10, EMoveTypes.left, newImage, crop, imageBorders);
          break;
        case EMoveTypes.bottom:
          resizeTopOverView(step * 10, newImage, crop, imageBorders);
          break;
        case EMoveTypes.left:
          resizeRightOverView(step * 10, EMoveTypes.right, newImage, crop, imageBorders);
          break;
      }

      adjustShapePostion(newImage);

      if (step === 10) {
        if (image.angle) {
          stepProperties.stop = true;
        } else if (
          (newImage.x === crop.x && newImage.width === crop.width) ||
          (newImage.y === crop.y && newImage.height === crop.height)
        ) {
          stepProperties.stop = true;
        } else {
          stepProperties.isStartPosition = true;
        }
      }
      if (image.angle) {
        const inscriptedImage = getInscriptedImage(
          newImage,
          image.angle,
          image.aspectRatio,
          startPosition.ratio || 1,
          O
        );

        image.x = inscriptedImage.x;
        image.y = inscriptedImage.y;
        image.width = inscriptedImage.width;
        image.height = inscriptedImage.height;
      } else {
        image.x = newImage.x;
        image.y = newImage.y;
        image.width = newImage.width;
        image.height = newImage.height;
      }
    }
  } else {
    const ar = image.startPosition.width / image.startPosition.height;

    const relativeX = imageDC.left / image.startPosition.width;
    const relativeY = imageDC.top / image.startPosition.height;

    const newImage: IDynamicShape & { angle: number } = {
      angle: image.angle,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      startPosition: {
        x: image.x,
        y: image.y,
        width: image.width,
        height: image.height,
      },
    };

    let rel = 0;
    if (isZoomIn) {
      rel = (crop.width / 2 - iEZPS) / image.width;
      newImage.width = crop.width / 2 / rel;
      newImage.height = newImage.width / ar;

      newImage.x = O.x - newImage.width * relativeX;
      newImage.y = O.y - newImage.height * relativeY;
    } else {
      zoomOut(crop, newImage, stepProperties);
    }
    adjustShapePostion(newImage);

    image.x = newImage.x;
    image.y = newImage.y;
    image.width = newImage.width;
    image.height = newImage.height;
  }
  adjustShapePostion(image);
};
