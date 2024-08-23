import { IBorders, ICropShape, IDynamicShape, IPosition } from "../../../../../../types/interfaces";
import { EnumMoveTypes } from "../../../../../../types/enumerations";
import { iEBSLR, iEMSS } from "../../../../../../consts";
import { resetShape } from "../resizeCrop";

export const resizeLeft = (
  moveType: EnumMoveTypes,
  cursorDistance: IPosition,
  crop: ICropShape,
  image: IDynamicShape & { isImageChanged: boolean },
  imageBorders: IBorders,
  maxOverBorderRatio: IBorders
) => {
  const adjustCrop = () => {
    crop.height = crop.width / crop.aspectRatio;
    crop.x = crop.startPosition.x + (crop.startPosition.width - crop.width);
    const diff = crop.startPosition.height - crop.height;
    switch (moveType) {
      case EnumMoveTypes.leftTop:
        crop.y = crop.startPosition.y + diff;
        break;
      case EnumMoveTypes.leftBottom:
        crop.y = crop.startPosition.y;
        break;
      default:
        crop.y = crop.startPosition.y + diff / 2;
    }
  };

  const min = crop.startPosition.height > crop.startPosition.width ? iEMSS : iEMSS * crop.aspectRatio;
  if (crop.startPosition.width - cursorDistance.x > min) {
    if (cursorDistance.x > 0) {
      crop.width = crop.startPosition.width - cursorDistance.x;
      adjustCrop();
      if (image.x !== image.startPosition.x || image.y !== image.startPosition.y) {
        resetShape(image);
        image.isImageChanged = true;
      }
    } else {
      resetShape(crop);
      if (cursorDistance.x < 0) {
        const overBorder = -cursorDistance.x;
        let progress = 0;
        if (overBorder >= iEBSLR) progress = maxOverBorderRatio.left;
        else progress = Math.floor((overBorder * maxOverBorderRatio.left) / iEBSLR);
        resizeLeftOverView(progress, moveType, image, crop, imageBorders);
        image.isImageChanged = true;
      }
    }
  } else {
    crop.width = min;
    adjustCrop();
    resetShape(image);
    image.isImageChanged = true;
  }
};

export const resizeLeftOverView = (
  progress: number,
  moveType: EnumMoveTypes,
  image: IDynamicShape,
  crop: ICropShape,
  imageBorders: IBorders
) => {
  const aspectRatio = image.startPosition.width / image.startPosition.height;
  const isCenter = moveType === EnumMoveTypes.left && !!imageBorders.top && !!imageBorders.bottom;
  const isTop = isCenter
    ? imageBorders.top < imageBorders.bottom
    : moveType === EnumMoveTypes.left
    ? !!imageBorders.top
    : moveType === EnumMoveTypes.leftTop;
  const remainigDistanceY = isTop ? imageBorders.top : imageBorders.bottom;
  const helperAR = crop.aspectRatio * (isCenter ? 2 : 1);
  if (remainigDistanceY < imageBorders.left / helperAR) {
    const newDistance = (remainigDistanceY / 100) * progress;
    const startDistY = crop.startPosition.height / (isCenter ? 2 : 1) + imageBorders[isTop ? "top" : "bottom"];
    const startDistOpositeY = imageBorders[isTop ? "bottom" : "top"] + (isCenter ? crop.startPosition.height / 2 : 0);
    const diffPasive = (startDistOpositeY * newDistance) / startDistY;
    const diffY = isTop ? newDistance : diffPasive;
    const relativeRight = imageBorders.right / image.startPosition.width;
    image.height = image.startPosition.height - newDistance - diffPasive;
    image.width = image.height * aspectRatio;
    image.y = image.startPosition.y + diffY;
    const newRight = image.width * relativeRight + crop.width / 2;
    const newLeft = image.width - newRight;
    image.x = image.startPosition.x + (imageBorders.left + crop.width / 2 - newLeft);
  } else {
    const newDistance = (imageBorders.left / 100) * progress;
    const startDistLeft = imageBorders.left + crop.startPosition.width;
    const startDistRight = image.startPosition.width - startDistLeft;
    const relativeDiffLeft = newDistance / startDistLeft;
    const diffRight = startDistRight * relativeDiffLeft;
    image.width = image.startPosition.width - newDistance - diffRight;
    image.height = image.width / aspectRatio;
    const relativeTop =
      (imageBorders.top + (isCenter ? crop.height / 2 : isTop ? crop.height : 0)) / image.startPosition.height;
    const newDistToTop = image.height * relativeTop;
    image.x = image.startPosition.x + newDistance;
    image.y = crop.y + (isCenter ? crop.height / 2 : isTop ? crop.height : 0) - newDistToTop;
  }
};
