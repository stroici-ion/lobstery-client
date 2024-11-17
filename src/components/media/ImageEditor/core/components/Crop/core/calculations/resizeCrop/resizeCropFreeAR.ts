import { IBorders, ICropShape, IDynamicShape, IPosition, IShape } from '../../../../../../types/interfaces';
import { EMoveTypes } from '../../../../../../types/enums';
import { resizeBottomFree } from './directions/bottomFree';
import { resizeRightFree } from './directions/rightFree';
import { resizeLeftFree } from './directions/leftFree';
import { resizeTopFree } from './directions/topFree';
import { resizeLeft } from './directions/left';
import { adjustShapePostion } from '../../../../../utils/calc';

export const resizeCropFreeAR = (
  crop: ICropShape,
  image: IDynamicShape,
  cursorDistance: IPosition,
  moveType: EMoveTypes,
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
    case EMoveTypes.leftTop:
    case EMoveTypes.leftBottom:
      resizeLeft(moveType, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
      break;
    case EMoveTypes.left: {
      resizeLeftFree(cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio, viewBorders);
      break;
    }
    case EMoveTypes.rightTop:
    case EMoveTypes.rightBottom:
      resizeLeft(moveType, cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio);
      break;
    case EMoveTypes.right: {
      resizeRightFree(cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio, viewBorders);
      break;
    }
    case EMoveTypes.top: {
      resizeTopFree(cursorDistance, newCrop, newImage, imageBorders, maxOverBorderRatio, viewBorders);
      break;
    }
    case EMoveTypes.bottom: {
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
