import { IBorders, ICropShape, IDynamicShape, IPosition, IShape } from '../../../../../types/interfaces';
import { getAvailableResizeDirection } from '../../mouseMoveType/getAvailableDirection';
import { EnumMoveTypes } from '../../../../../types/enumerations';
import { adjustShapePostion } from './resizeCropFreeAR';
import { resizeBottom } from './directions/bottom';
import { resizeLeft } from './directions/left';
import { resizeRight } from './directions/right';
import { resizeTop } from './directions/top';

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
  moveType: EnumMoveTypes,
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
      case EnumMoveTypes.leftTop:
      case EnumMoveTypes.leftBottom: {
        resizeLeft(moveType, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      }
      case EnumMoveTypes.left: {
        let stop = false;
        const availableDirection = getAvailableResizeDirection(image.angle, imageRotatedBorders);
        if (availableDirection)
          switch (availableDirection) {
            case EnumMoveTypes.leftTop:
            case EnumMoveTypes.leftBottom:
              resizeLeft(availableDirection, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
              stop = true;
          }
        if (stop) break;
        resizeLeft(moveType, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      }
      case EnumMoveTypes.top: {
        let stop = false;
        if (image.angle && cursorDistance.y < 0) {
          const availableDirection = getAvailableResizeDirection(image.angle, imageRotatedBorders);
          switch (availableDirection) {
            case EnumMoveTypes.rightTop:
              resizeRight(
                EnumMoveTypes.rightTop,
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
            case EnumMoveTypes.leftTop:
              resizeLeft(
                EnumMoveTypes.leftTop,
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
      case EnumMoveTypes.rightTop:
      case EnumMoveTypes.rightBottom: {
        resizeRight(moveType, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      }
      case EnumMoveTypes.right: {
        let stop = false;
        const availableDirection = getAvailableResizeDirection(image.angle, imageRotatedBorders);
        if (availableDirection)
          switch (availableDirection) {
            case EnumMoveTypes.rightTop:
            case EnumMoveTypes.rightBottom:
              resizeRight(availableDirection, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
              stop = true;
          }
        if (stop) break;
        resizeRight(moveType, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      }
      case EnumMoveTypes.bottom: {
        let stop = false;
        if (image.angle && cursorDistance.y > 0) {
          const availableDirection = getAvailableResizeDirection(image.angle, imageRotatedBorders);
          switch (availableDirection) {
            case EnumMoveTypes.rightBottom:
              resizeRight(
                EnumMoveTypes.rightBottom,
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
            case EnumMoveTypes.leftBottom:
              resizeLeft(
                EnumMoveTypes.leftBottom,
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
      case EnumMoveTypes.leftTop:
      case EnumMoveTypes.leftBottom:
      case EnumMoveTypes.left:
        resizeLeft(moveType, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      case EnumMoveTypes.top:
        resizeTop(cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      case EnumMoveTypes.rightTop:
      case EnumMoveTypes.rightBottom:
      case EnumMoveTypes.right: {
        resizeRight(moveType, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
        break;
      }
      case EnumMoveTypes.bottom: {
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
