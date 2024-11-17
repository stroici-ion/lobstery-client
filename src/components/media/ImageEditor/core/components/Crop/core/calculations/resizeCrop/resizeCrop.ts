import { IBorders, ICropShape, IDynamicShape, IPosition, IShape } from '../../../../../../types/interfaces';
import { getAvailableResizeDirection } from '../../mouseMoveType/getAvailableDirection';
import { EMoveTypes } from '../../../../../../types/enums';
import { resizeBottom } from './directions/bottom';
import { resizeLeft } from './directions/left';
import { resizeRight } from './directions/right';
import { resizeTop } from './directions/top';
import { adjustShapePostion } from '../../../../../utils/calc';

export const getMin = (x: number, y: number) => {
  return x > y ? y : x;
};

export const resetShape = (shape: IDynamicShape) => {
  shape.x = shape.startPosition.x;
  shape.y = shape.startPosition.y;
  shape.width = shape.startPosition.width;
  shape.height = shape.startPosition.height;
};

export const resizeCrop = (
  crop: ICropShape,
  image: IShape & { startPosition: IShape; angle: number },
  cursorDistance: IPosition,
  moveType: EMoveTypes,
  imageBorders: IBorders,
  imageRotatedBorders: IBorders,
  viewBorders: IBorders,
  maxOverBorderRatio: IBorders
) => {
  //New Edited Crop
  let newCrop = {
    ...crop,
    startPosition: {
      ...crop.startPosition,
    },
  };

  //New Edited Image - Can be simple image or outer image if it is rotated
  let newImage = {
    isImageChanged: false,
    ...image,
    startPosition: {
      ...image.startPosition,
    },
  };
  if (image.angle) {
    switch (moveType) {
      case EMoveTypes.leftTop:
      case EMoveTypes.leftBottom: {
        resizeLeft(moveType, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      }
      case EMoveTypes.left: {
        let stop = false;
        const availableDirection = getAvailableResizeDirection(image.angle, imageRotatedBorders);
        if (availableDirection)
          switch (availableDirection) {
            case EMoveTypes.leftTop:
            case EMoveTypes.leftBottom:
              resizeLeft(availableDirection, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
              stop = true;
          }
        if (stop) break;
        resizeLeft(moveType, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      }
      case EMoveTypes.top: {
        let stop = false;
        if (image.angle && cursorDistance.y < 0) {
          const availableDirection = getAvailableResizeDirection(image.angle, imageRotatedBorders);
          switch (availableDirection) {
            case EMoveTypes.rightTop:
              resizeRight(
                EMoveTypes.rightTop,
                {
                  x: cursorDistance.y * -1,
                  y: 0,
                },
                newCrop,
                newImage,
                imageBorders,
                maxOverBorderRatio
              );
              stop = true;
              break;
            case EMoveTypes.leftTop:
              resizeLeft(
                EMoveTypes.leftTop,
                {
                  x: cursorDistance.y,
                  y: 0,
                },
                newCrop,
                newImage,
                imageBorders,
                maxOverBorderRatio
              );
              stop = true;
              break;
          }
        }
        if (stop) break;
        resizeTop(cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      }
      case EMoveTypes.rightTop:
      case EMoveTypes.rightBottom: {
        resizeRight(moveType, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      }
      case EMoveTypes.right: {
        let stop = false;
        const availableDirection = getAvailableResizeDirection(image.angle, imageRotatedBorders);
        if (availableDirection)
          switch (availableDirection) {
            case EMoveTypes.rightTop:
            case EMoveTypes.rightBottom:
              resizeRight(availableDirection, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
              stop = true;
          }
        if (stop) break;
        resizeRight(moveType, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      }
      case EMoveTypes.bottom: {
        let stop = false;
        if (image.angle && cursorDistance.y > 0) {
          const availableDirection = getAvailableResizeDirection(image.angle, imageRotatedBorders);
          switch (availableDirection) {
            case EMoveTypes.rightBottom:
              resizeRight(
                EMoveTypes.rightBottom,
                {
                  x: cursorDistance.y,
                  y: 0,
                },
                newCrop,
                newImage,
                imageBorders,
                maxOverBorderRatio
              );
              stop = true;
              break;
            case EMoveTypes.leftBottom:
              resizeLeft(
                EMoveTypes.leftBottom,
                {
                  x: cursorDistance.y * -1,
                  y: 0,
                },
                newCrop,
                newImage,
                imageBorders,
                maxOverBorderRatio
              );
              stop = true;
              break;
          }
        }
        if (stop) break;
        resizeBottom(cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      }
    }
  } else {
    switch (moveType) {
      case EMoveTypes.leftTop:
      case EMoveTypes.leftBottom:
      case EMoveTypes.left:
        resizeLeft(moveType, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      case EMoveTypes.top:
        resizeTop(cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      case EMoveTypes.rightTop:
      case EMoveTypes.rightBottom:
      case EMoveTypes.right: {
        resizeRight(moveType, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      }
      case EMoveTypes.bottom: {
        resizeBottom(cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      }
    }
  }

  adjustShapePostion(newCrop);
  adjustShapePostion(newImage);

  return {
    isImageChanged: newImage.isImageChanged,
    newCrop,
    newImage,
  };
};
