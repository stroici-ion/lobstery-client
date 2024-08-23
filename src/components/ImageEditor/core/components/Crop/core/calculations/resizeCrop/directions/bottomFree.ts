import { iEBSB, iEMAR, iEMSS, iESBAD } from '../../../../../../consts';
import { IBorders, ICropShape, IDynamicShape, IPosition } from '../../../../../../types/interfaces';

export const resizeBottomFree = (
  cursorDistance: IPosition,
  crop: ICropShape,
  image: IDynamicShape & { isImageChanged: boolean },
  imageBorders: IBorders,
  maxOverBorderRatio: IBorders,
  viewBorders: IBorders
) => {
  if (crop.startPosition.height + cursorDistance.y > iEMSS) {
    if (cursorDistance.y < 0) {
      crop.height = crop.startPosition.height + cursorDistance.y;
      crop.y = crop.startPosition.y;
      if (image.x !== image.startPosition.x || image.y !== image.startPosition.y) {
        image.x = image.startPosition.x;
        image.y = image.startPosition.y;
        image.width = image.startPosition.width;
        image.height = image.startPosition.height;
        image.isImageChanged = true;
      }
    } else {
      if (cursorDistance.y < viewBorders.bottom) {
        if (imageBorders.bottom / 2 - cursorDistance.y <= iESBAD) cursorDistance.y = imageBorders.bottom / 2;
        crop.x = crop.startPosition.x;
        crop.y = crop.startPosition.y - cursorDistance.y;
        crop.width = crop.startPosition.width;
        crop.height = crop.startPosition.height + cursorDistance.y * 2;

        image.x = image.startPosition.x;
        image.y = image.startPosition.y - cursorDistance.y;
        image.width = image.startPosition.width;
        image.height = image.startPosition.height;
        image.isImageChanged = true;
      } else {
        if (viewBorders.bottom * 2 < imageBorders.bottom) {
          const overBorder = Math.abs(viewBorders.bottom - cursorDistance.y);

          let progress = 0;
          if (overBorder >= iEBSB) progress = maxOverBorderRatio.bottom;
          else progress = Math.floor((overBorder * maxOverBorderRatio.bottom) / iEBSB);

          resizeBottomFreeOverView(progress, image, crop, viewBorders);
          image.isImageChanged = true;
        }
      }
    }
  } else {
    crop.height = iEMSS;
    crop.y = crop.startPosition.y;
    if (image.y !== image.startPosition.y) {
      image.y = image.startPosition.y;
      image.isImageChanged = true;
    }
  }
};

export const resizeBottomFreeOverView = (progress: number, image: IDynamicShape, crop: ICropShape, viewBorders: IBorders) => {
  let cropX = crop.startPosition.y - viewBorders.bottom;
  const cropHeight = crop.startPosition.height + viewBorders.bottom * 2;
  const imageStartPosition = image.startPosition.y - viewBorders.bottom;
  const fullDistance = image.startPosition.height - (cropX - imageStartPosition);
  const distance = fullDistance - cropHeight;
  const diff = (distance / 100) * progress;
  const newFullDistance = fullDistance - diff;
  const minimizeOpositeRatio = newFullDistance / fullDistance;
  const startDistanceOposite = cropX - imageStartPosition;
  const newDistanceOposite = startDistanceOposite * minimizeOpositeRatio;
  const diffOposite = startDistanceOposite - newDistanceOposite;
  const imageHeight = image.startPosition.height - diff - diffOposite;
  const imageY = imageStartPosition + diffOposite;
  const aspectRatio = image.startPosition.width / image.startPosition.height;
  const imageWidth = imageHeight * aspectRatio;
  const relativeCropSize = crop.startPosition.width / image.startPosition.width;
  const relativeCropPosition = (crop.startPosition.x - image.startPosition.x) / image.startPosition.width;
  const cropWidth = imageWidth * relativeCropSize;
  cropX = crop.startPosition.x + (crop.startPosition.width - cropWidth) / 2;
  const imageX = cropX - imageWidth * relativeCropPosition;

  if (cropWidth / cropHeight >= iEMAR) {
    crop.x = cropX;
    crop.width = cropWidth;
    crop.height = cropHeight;
    image.x = imageX;
    image.y = imageY;
    image.width = imageWidth;
    image.height = imageHeight;
  }
};
