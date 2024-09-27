import { IBorders, ICropShape, IDynamicShape, IPosition } from '../../../../../../types/interfaces';
import { EnumMoveTypes } from '../../../../../../types/enumerations';
import { resetShape } from '../resizeCrop';
import { iEBSLR, iEMSS } from '../../../../../../consts';

export const resizeRight = (
  moveType: EnumMoveTypes,
  cursorDistance: IPosition,
  crop: ICropShape,
  image: IDynamicShape & { isImageChanged: boolean },
  imageBorders: IBorders,
  maxOverBorderRatio: IBorders
) => {
  const adjustCrop = () => {
    crop.height = crop.width / crop.aspectRatio;
    const diff = crop.startPosition.height - crop.height;
    switch (moveType) {
      case EnumMoveTypes.rightTop:
        crop.y = crop.startPosition.y + diff;
        break;
      case EnumMoveTypes.rightBottom:
        crop.y = crop.startPosition.y;
        break;
      default:
        crop.y = crop.startPosition.y + diff / 2;
    }
  };

  const min = crop.startPosition.height > crop.startPosition.width ? iEMSS : iEMSS * crop.aspectRatio;
  if (crop.startPosition.width + cursorDistance.x > min) {
    if (cursorDistance.x < 0) {
      crop.width = crop.startPosition.width + cursorDistance.x;
      adjustCrop();
      if (image.x !== image.startPosition.x || image.y !== image.startPosition.y) {
        resetShape(image);
        image.isImageChanged = true;
      }
    } else {
      resetShape(crop);
      const overBorder = cursorDistance.x;
      let progress = 0;
      if (overBorder >= iEBSLR) progress = maxOverBorderRatio.right;
      else progress = Math.floor((overBorder * maxOverBorderRatio.right) / iEBSLR);
      resizeRightOverView(progress, moveType, image, crop, imageBorders);
      image.isImageChanged = true;
    }
  } else {
    crop.width = min;
    adjustCrop();
    resetShape(image);
    image.isImageChanged = true;
  }
};

export const resizeRightOverView = (
  progress: number,
  moveType: EnumMoveTypes,
  image: IDynamicShape,
  crop: ICropShape,
  imageBorders: IBorders
) => {
  const aspectRatio = image.startPosition.width / image.startPosition.height;
  const isCenter = moveType === EnumMoveTypes.right && !!imageBorders.top && !!imageBorders.bottom;

  const isTop = isCenter
    ? imageBorders.top < imageBorders.bottom
    : moveType === EnumMoveTypes.right
    ? !!imageBorders.top
    : moveType === EnumMoveTypes.rightTop;

  const remainigDistanceY = isTop ? imageBorders.top : imageBorders.bottom;
  const helperAR = crop.aspectRatio * (isCenter ? 2 : 1);
  if (remainigDistanceY < imageBorders.right / helperAR) {
    const newDistance = (remainigDistanceY / 100) * progress;
    const startDistY = crop.startPosition.height / (isCenter ? 2 : 1) + imageBorders[isTop ? 'top' : 'bottom'];
    const startDistOpositeY = imageBorders[isTop ? 'bottom' : 'top'] + (isCenter ? crop.startPosition.height / 2 : 0);

    const diffPasive = (startDistOpositeY * newDistance) / startDistY;
    const diffY = isTop ? newDistance : diffPasive;

    image.height = image.startPosition.height - newDistance - diffPasive;
    image.width = image.height * aspectRatio;
    image.y = image.startPosition.y + diffY;

    const relativeLeft = imageBorders.left / image.startPosition.width;
    const newLeft = image.width * relativeLeft;

    image.x = crop.startPosition.x - newLeft;
  } else {
    const newDistance = (imageBorders.right / 100) * progress;
    const startDistRight = imageBorders.right + crop.startPosition.width;
    const startDistLeft = image.startPosition.width - startDistRight;

    const relativeDiffRight = newDistance / startDistRight;
    const diffLeft = startDistLeft * relativeDiffRight;

    image.width = image.startPosition.width - newDistance - diffLeft;
    image.height = image.width / aspectRatio;
    const relativeTop =
      (imageBorders.top + (isCenter ? crop.height / 2 : isTop ? crop.height : 0)) / image.startPosition.height;
    const newDistToTop = image.height * relativeTop;
    image.x = image.startPosition.x + diffLeft;
    image.y = crop.y + (isCenter ? crop.height / 2 : isTop ? crop.height : 0) - newDistToTop;
  }
};
