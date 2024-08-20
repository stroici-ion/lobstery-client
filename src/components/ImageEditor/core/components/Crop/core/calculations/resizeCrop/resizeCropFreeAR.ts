import { IBorders, ICropShape, IDynamicShape, IPosition, IShape } from '../../../../../types/interfaces';
import { EnumMoveTypes } from '../../../../../types/enumerations';
import { resizeBottomFree } from './directions/bottomFree';
import { resizeRightFree } from './directions/rightFree';
import { resizeLeftFree } from './directions/leftFree';
import { resizeTopFree } from './directions/topFree';
import { resizeLeft } from './directions/left';

export const resizeCropFreeAR = (
  crop: ICropShape,
  image: IDynamicShape,
  cursorDistance: IPosition,
  moveType: EnumMoveTypes,
  imageBorders: IBorders,
  viewBorders: IBorders,
  maxOverBorderRatio: IBorders
) => {
  const newCrop = {
    ...crop,
    startPosition: {
      ...crop.startPosition,
    },
  };

  const newImage = {
    isImageChanged: false,
    ...image,
    startPosition: {
      ...image.startPosition,
    },
  };

  switch (moveType) {
    case EnumMoveTypes.leftTop:
    case EnumMoveTypes.leftBottom:
      resizeLeft(moveType, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
      break;
    case EnumMoveTypes.left: {
      resizeLeftFree(cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio, viewBorders);
      break;
    }
    case EnumMoveTypes.rightTop:
    case EnumMoveTypes.rightBottom:
      resizeLeft(moveType, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
      break;
    case EnumMoveTypes.right: {
      resizeRightFree(cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio, viewBorders);
      break;
    }
    case EnumMoveTypes.top: {
      resizeTopFree(cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio, viewBorders);
      break;
    }
    case EnumMoveTypes.bottom: {
      resizeBottomFree(cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio, viewBorders);
      break;
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

export const adjustShapePostion = (shape: IShape) => {
  shape.x = Math.floor(shape.x);
  shape.y = Math.floor(shape.y);
  shape.width = Math.ceil(shape.width);
  shape.height = Math.ceil(shape.height);
};
