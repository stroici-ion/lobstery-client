import { iEBST, iEMSS } from '../../../../../../config';
import { IBorders, ICropShape, IDynamicShape, IPosition } from '../../../../../../../types/interfaces';
import { resetShape } from '../resizeCrop';

export const resizeTop = (
  cursorDistance: IPosition,
  crop: ICropShape,
  image: IDynamicShape & { isImageChanged: boolean },
  imageBorders: IBorders,
  maxOverBorderRatio: IBorders
) => {
  const adjustCrop = () => {
    crop.width = crop.height * crop.aspectRatio;
    crop.y = crop.startPosition.y + (crop.startPosition.height - crop.height);
    const diff = crop.startPosition.width - crop.width;
    crop.x = crop.startPosition.x + diff / 2;
  };

  const min = crop.startPosition.height < crop.startPosition.width ? iEMSS : iEMSS / crop.aspectRatio;
  if (crop.startPosition.height - cursorDistance.y > min) {
    if (cursorDistance.y > 0) {
      crop.height = crop.startPosition.height - cursorDistance.y;
      adjustCrop();
      if (image.x !== image.startPosition.x || image.y !== image.startPosition.y) {
        resetShape(image);
        image.isImageChanged = true;
      }
    } else {
      resetShape(crop);
      if (cursorDistance.y < 0) {
        const overBorder = -cursorDistance.y;
        let progress = 0;
        if (overBorder >= iEBST) progress = maxOverBorderRatio.top;
        else progress = Math.floor((overBorder * maxOverBorderRatio.top) / iEBST);
        resizeTopOverView(progress, image, crop, imageBorders);
        image.isImageChanged = true;
      }
    }
  } else {
    crop.height = min;
    adjustCrop();
    resetShape(image);
    image.isImageChanged = true;
  }
};

export const resizeTopOverView = (progress: number, image: IDynamicShape, crop: ICropShape, imageBorders: IBorders) => {
  const aspectRatio = image.startPosition.width / image.startPosition.height;

  const isCenter = !!imageBorders.left && !!imageBorders.right;
  const isLeft = isCenter ? imageBorders.left < imageBorders.right : !!imageBorders.left;

  const remainigDistanceX = isLeft ? imageBorders.left : imageBorders.right;

  const helperAR = crop.aspectRatio / (isCenter ? 2 : 1);

  if (remainigDistanceX < imageBorders.top * helperAR) {
    const newDistance = (remainigDistanceX / 100) * progress;

    const startDistX = crop.startPosition.width / (isCenter ? 2 : 1) + imageBorders[isLeft ? 'left' : 'right'];

    const startDistOpositeX = imageBorders[isLeft ? 'right' : 'left'] + (isCenter ? crop.startPosition.width / 2 : 0);

    const diffPasive = (startDistOpositeX * newDistance) / startDistX;
    const diffX = isLeft ? newDistance : diffPasive;

    const relativeBottom = imageBorders.bottom / image.startPosition.height;

    image.width = image.startPosition.width - newDistance - diffPasive;
    image.height = image.width / aspectRatio;

    image.x = image.startPosition.x + diffX;

    const newBottom = image.height * relativeBottom + crop.height / 2;
    const newTop = image.height - newBottom;
    image.y = image.startPosition.y + (imageBorders.top + crop.height / 2 - newTop);
  } else {
    //If distance on X is smaler
    const newDistance = (imageBorders.top / 100) * progress;
    const startDistTop = imageBorders.top + crop.startPosition.height;
    const startDistBottom = image.startPosition.height - startDistTop;

    const relativeDiffTop = newDistance / startDistTop;
    const diffBottom = startDistBottom * relativeDiffTop;

    image.height = image.startPosition.height - newDistance - diffBottom;
    image.width = image.height * aspectRatio;

    const relativeLeft =
      (imageBorders.left + (isCenter ? crop.width / 2 : isLeft ? crop.width : 0)) / image.startPosition.width;

    const newDistToLeft = image.width * relativeLeft;
    image.y = image.startPosition.y + newDistance;
    image.x = crop.x + (isCenter ? crop.width / 2 : isLeft ? crop.width : 0) - newDistToLeft;
  }
};
