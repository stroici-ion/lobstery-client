import { iEBST, iEMAR, iEMSS, iESBAD } from '../../../../../../config';
import { IBorders, ICropShape, IDynamicShape, IPosition } from '../../../../../../../types/interfaces';

export const resizeTopFree = (
  cursorDistance: IPosition,
  crop: ICropShape,
  image: IDynamicShape & { isImageChanged: boolean },
  imageBorders: IBorders,
  maxOverBorderRatio: IBorders,
  viewBorders: IBorders
) => {
  if (crop.startPosition.height - cursorDistance.y > iEMSS) {
    if (cursorDistance.y > 0) {
      crop.y = crop.startPosition.y + cursorDistance.y;
      crop.height = crop.startPosition.height - cursorDistance.y;
      if (image.y !== image.startPosition.y || image.x !== image.x) {
        image.x = image.startPosition.x;
        image.y = image.startPosition.y;
        image.width = image.startPosition.width;
        image.height = image.startPosition.height;
        image.isImageChanged = true;
      }
    } else {
      if (cursorDistance.y * -1 < viewBorders.top) {
        if (imageBorders.top / 2 + cursorDistance.y <= iESBAD) cursorDistance.y = imageBorders.top / -2;
        crop.x = crop.startPosition.x;
        crop.y = crop.startPosition.y + cursorDistance.y;
        crop.width = crop.startPosition.width;
        crop.height = crop.startPosition.height - cursorDistance.y * 2;

        image.x = image.startPosition.x;
        image.y = image.startPosition.y - cursorDistance.y;
        image.width = image.startPosition.width;
        image.height = image.startPosition.height;
        image.isImageChanged = true;
      } else {
        if (viewBorders.top * 2 < imageBorders.top) {
          const overBorder = Math.abs(viewBorders.top + cursorDistance.y);

          let progress = 0;
          if (overBorder >= iEBST) progress = maxOverBorderRatio.top;
          else progress = (overBorder * maxOverBorderRatio.top) / iEBST;

          resizeTopFreeOverView(progress, image, crop, viewBorders);

          image.isImageChanged = true;
        }
      }
    }
  } else {
    crop.height = iEMSS;
    crop.y = crop.startPosition.y + crop.startPosition.height - iEMSS;
    if (image.y !== image.startPosition.y) {
      image.y = image.startPosition.y;
      image.isImageChanged = true;
    }
  }
};

export const resizeTopFreeOverView = (
  progress: number,
  image: IDynamicShape,
  crop: ICropShape,
  viewBorders: IBorders
) => {
  const remainigDistance = crop.startPosition.y - image.startPosition.y - viewBorders.top * 2;
  const cropStretchDist = viewBorders.top * -1;
  const cropY = crop.startPosition.y + cropStretchDist;
  const cropHeight = crop.startPosition.height - cropStretchDist * 2;
  const newDistance = (remainigDistance / 100) * progress;
  const imageY = image.startPosition.y - cropStretchDist + newDistance;
  const startDistance = crop.startPosition.y + crop.startPosition.height - image.startPosition.y;
  const sizeRatio = startDistance / image.startPosition.height;
  const currentDistance = cropY + cropHeight - imageY;
  const imageHeight = currentDistance / sizeRatio;
  const aspectRatio = image.startPosition.width / image.startPosition.height;
  const imageWidth = imageHeight * aspectRatio;
  const relativeOpositeSize = crop.startPosition.width / image.startPosition.width;
  const relativeOpositeAxis = (crop.startPosition.x - image.startPosition.x) / image.startPosition.width;
  const cropWidth = imageWidth * relativeOpositeSize;
  const cropX = crop.startPosition.x + (crop.startPosition.width - cropWidth) / 2;
  const imageX = cropX - imageWidth * relativeOpositeAxis;

  if (cropWidth / cropHeight >= iEMAR) {
    crop.y = cropY;
    crop.x = cropX;
    crop.width = cropWidth;
    crop.height = cropHeight;
    image.x = imageX;
    image.y = imageY;
    image.width = imageWidth;
    image.height = imageHeight;
  }
};
