import { iEBSLR, iEMAR, iEMSS, iESBAD } from '../../../../../../config';
import { IBorders, ICropShape, IDynamicShape, IPosition } from '../../../../../../../types/interfaces';

export const resizeRightFree = (
  cursorDistance: IPosition,
  crop: ICropShape,
  image: IDynamicShape & { isImageChanged: boolean },
  imageBorders: IBorders,
  maxOverBorderRatio: IBorders,
  viewBorders: IBorders
) => {
  if (crop.startPosition.width + cursorDistance.x > iEMSS) {
    if (cursorDistance.x < 0) {
      crop.width = crop.startPosition.width + cursorDistance.x;
      crop.x = crop.startPosition.x;
      if (image.x !== image.startPosition.x || image.y !== image.startPosition.y) {
        image.x = image.startPosition.x;
        image.y = image.startPosition.y;
        image.width = image.startPosition.width;
        image.height = image.startPosition.height;
        image.isImageChanged = true;
      }
    } else {
      if (cursorDistance.x < viewBorders.right) {
        if (imageBorders.right / 2 - cursorDistance.x <= iESBAD) cursorDistance.x = imageBorders.right / 2;
        crop.y = crop.startPosition.y;
        crop.x = crop.startPosition.x - cursorDistance.x;
        crop.width = crop.startPosition.width + cursorDistance.x * 2;
        crop.height = crop.startPosition.height;

        image.x = image.startPosition.x - cursorDistance.x;
        image.y = image.startPosition.y;
        image.width = image.startPosition.width;
        image.height = image.startPosition.height;
        image.isImageChanged = true;
      } else {
        if (viewBorders.right * 2 < imageBorders.right) {
          const overBorder = Math.abs(viewBorders.right - cursorDistance.x);

          let progress = 0;
          if (overBorder >= iEBSLR) progress = maxOverBorderRatio.right;
          else progress = Math.floor((overBorder * maxOverBorderRatio.right) / iEBSLR);

          resizeRightFreeOverView(progress, image, crop, viewBorders);
          image.isImageChanged = true;
        }
      }
    }
  } else {
    crop.width = iEMSS;
    crop.x = crop.startPosition.x;
    if (image.x !== image.startPosition.x) {
      image.x = image.startPosition.x;
      image.isImageChanged = true;
    }
  }
};

export const resizeRightFreeOverView = (
  progress: number,
  image: IDynamicShape,
  crop: ICropShape,
  viewBorders: IBorders
) => {
  const cropX = crop.startPosition.x - viewBorders.right;
  const cropWidth = crop.startPosition.width + viewBorders.right * 2;
  const imageStartPosition = image.startPosition.x - viewBorders.right;
  const fullDistance = image.startPosition.width - (cropX - imageStartPosition);
  const distance = fullDistance - cropWidth;
  const diff = (distance / 100) * progress;
  const newFullDistance = fullDistance - diff;
  const minimizeOpositeRatio = newFullDistance / fullDistance;
  const startDistanceOposite = cropX - imageStartPosition;
  const newDistanceOposite = startDistanceOposite * minimizeOpositeRatio;
  const diffOposite = startDistanceOposite - newDistanceOposite;
  const imageWidth = image.startPosition.width - diff - diffOposite;
  const imageX = imageStartPosition + diffOposite;
  const aspectRatio = image.startPosition.width / image.startPosition.height;
  const imageHeight = imageWidth / aspectRatio;
  const relativeCropSize = crop.startPosition.height / image.startPosition.height;
  const relativeCropPosition = (crop.startPosition.y - image.startPosition.y) / image.startPosition.height;
  const cropHeight = imageHeight * relativeCropSize;
  const cropY = crop.startPosition.y + (crop.startPosition.height - cropHeight) / 2;
  const imageY = cropY - imageHeight * relativeCropPosition;

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
