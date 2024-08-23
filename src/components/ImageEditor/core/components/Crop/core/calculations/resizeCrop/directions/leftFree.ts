import { iEBSLR, iEMAR, iEMSS, iESBAD } from '../../../../../../consts';
import { IBorders, ICropShape, IDynamicShape, IPosition } from '../../../../../../types/interfaces';

export const resizeLeftFree = (
  cursorDistance: IPosition,
  crop: ICropShape,
  image: IDynamicShape & { isImageChanged: boolean },
  imageBorders: IBorders,
  maxOverBorderRatio: IBorders,
  viewBorders: IBorders
) => {
  if (crop.startPosition.width - cursorDistance.x > iEMSS) {
    if (cursorDistance.x > 0) {
      crop.x = crop.startPosition.x + cursorDistance.x;
      crop.width = crop.startPosition.width - cursorDistance.x;
      if (image.x !== image.startPosition.x || image.y !== image.y) {
        image.x = image.startPosition.x;
        image.y = image.startPosition.y;
        image.width = image.startPosition.width;
        image.height = image.startPosition.height;
        image.isImageChanged = true;
      }
    } else {
      if (cursorDistance.x * -1 < viewBorders.left) {
        if (imageBorders.left / 2 + cursorDistance.x <= iESBAD) cursorDistance.x = imageBorders.left / -2;
        crop.y = crop.startPosition.y;
        crop.x = crop.startPosition.x + cursorDistance.x;
        crop.width = crop.startPosition.width - cursorDistance.x * 2;
        crop.height = crop.startPosition.height;
        image.x = image.startPosition.x - cursorDistance.x;
        image.y = image.startPosition.y;
        image.width = image.startPosition.width;
        image.height = image.startPosition.height;
        image.isImageChanged = true;
      } else {
        if (viewBorders.left * 2 < imageBorders.left) {
          const overBorder = Math.abs(viewBorders.left + cursorDistance.x);
          let progress = 0;
          if (overBorder >= iEBSLR) progress = maxOverBorderRatio.left;
          else progress = (overBorder * maxOverBorderRatio.left) / iEBSLR;
          resizeLeftFreeOverView(progress, image, crop, viewBorders);
          image.isImageChanged = true;
        }
      }
    }
  } else {
    crop.width = iEMSS;
    crop.x = crop.startPosition.x + crop.startPosition.width - iEMSS;
    if (image.x !== image.startPosition.x) {
      image.x = image.startPosition.x;
      image.isImageChanged = true;
    }
  }
};

export const resizeLeftFreeOverView = (progress: number, image: IDynamicShape, crop: ICropShape, viewBorders: IBorders) => {
  const remainigDistance = crop.startPosition.x - image.startPosition.x - viewBorders.left * 2;
  const cropStretchDist = viewBorders.left * -1;
  const cropX = crop.startPosition.x + cropStretchDist;
  const cropWidth = crop.startPosition.width - cropStretchDist * 2;
  const newDistance = (remainigDistance / 100) * progress;
  const imageX = image.startPosition.x - cropStretchDist + newDistance;
  const startDistance = crop.startPosition.x + crop.startPosition.width - image.startPosition.x;
  const sizeRatio = startDistance / image.startPosition.width;
  const currentDistance = cropX + cropWidth - imageX;
  const imageWidth = currentDistance / sizeRatio;
  const aspectRatio = image.startPosition.width / image.startPosition.height;
  const imageHeight = imageWidth / aspectRatio;
  const relativeOpositeSize = crop.startPosition.height / image.startPosition.height;
  const relativeOpositeAxis = (crop.startPosition.y - image.startPosition.y) / image.startPosition.height;
  const cropHeight = imageHeight * relativeOpositeSize;
  const cropY = crop.startPosition.y + (crop.startPosition.height - cropHeight) / 2;
  const imageY = cropY - imageHeight * relativeOpositeAxis;

  if (cropHeight / cropWidth >= iEMAR) {
    crop.x = cropX;
    crop.y = cropY;
    crop.width = cropWidth;
    crop.height = cropHeight;
    image.x = imageX;
    image.y = imageY;
    image.width = imageWidth;
    image.height = imageHeight;
  }
};
