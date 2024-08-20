import { imageEditorMinSelectionSize as iEMSZ } from '../../../../../../../../../../../utils/consts';
import { imageEditorBorderSizeBottom as iEBSB } from '../../../../../../../../../../../utils/consts';
import { IBorders, ICropShape, IDynamicShape, IPosition } from '../../../../../../Types/Interfaces';
import { resetShape } from '../resizeCrop';

export const resizeBottom = (
  cursorDistance: IPosition,
  crop: ICropShape,
  image: IDynamicShape & { isImageChanged: boolean },
  imageBorders: IBorders,
  maxOverBorderRatio: IBorders
) => {
  const adjustCrop = () => {
    crop.width = crop.height * crop.aspectRatio;
    crop.y = crop.startPosition.y;
    const diff = crop.startPosition.width - crop.width;
    crop.x = crop.startPosition.x + diff / 2;
  };

  if (crop.startPosition.height + cursorDistance.y > iEMSZ) {
    if (cursorDistance.y < 0) {
      crop.height = crop.startPosition.height + cursorDistance.y;
      adjustCrop();
      if (image.x !== image.startPosition.x || image.y !== image.startPosition.y) {
        resetShape(image);
        image.isImageChanged = true;
      }
    } else {
      resetShape(crop);
      const overBorder = cursorDistance.y;
      let progress = 0;
      if (overBorder >= iEBSB) progress = maxOverBorderRatio.bottom;
      else progress = Math.floor((overBorder * maxOverBorderRatio.bottom) / iEBSB);
      resizeBottomOverView(progress, image, crop, imageBorders);
      image.isImageChanged = true;
    }
  } else {
    crop.height = iEMSZ;
    adjustCrop();
    resetShape(image);
    image.isImageChanged = true;
  }
};

export const resizeBottomOverView = (progress: number, image: IDynamicShape, crop: ICropShape, imageBorders: IBorders) => {
  const aspectRatio = image.startPosition.width / image.startPosition.height;
  const isCenter = !!imageBorders.left && !!imageBorders.right;
  const isLeft = isCenter ? imageBorders.left < imageBorders.right : !!imageBorders.left;
  const helperAR = crop.aspectRatio / (isCenter ? 2 : 1);
  const remainigDistanceX = isLeft ? imageBorders.left : imageBorders.right;

  if (remainigDistanceX < imageBorders.bottom * helperAR) {
    const newDistance = (remainigDistanceX / 100) * progress;

    const startDistX = crop.startPosition.width / (isCenter ? 2 : 1) + imageBorders[isLeft ? 'left' : 'right'];

    const startDistOpositeX = imageBorders[isLeft ? 'right' : 'left'] + (isCenter ? crop.startPosition.width / 2 : 0);

    const diffPasive = (startDistOpositeX * newDistance) / startDistX;
    const diffX = isLeft ? newDistance : diffPasive;

    const relativeTop = imageBorders.top / image.startPosition.height;

    image.width = image.startPosition.width - newDistance - diffPasive;
    image.height = image.width / aspectRatio;

    image.x = image.startPosition.x + diffX;

    const newTop = image.height * relativeTop;
    image.y = crop.startPosition.y - newTop;
  } else {
    //If distance on X is smaler
    const newDistance = (imageBorders.bottom / 100) * progress;
    const startDistBottom = imageBorders.bottom + crop.startPosition.height;
    const startDistTop = image.startPosition.height - startDistBottom;

    const relativeDiffBottom = newDistance / startDistBottom;
    const diffTop = startDistTop * relativeDiffBottom;

    image.height = image.startPosition.height - newDistance - diffTop;
    image.width = image.height * aspectRatio;

    const relativeLeft = (imageBorders.left + (isCenter ? crop.width / 2 : isLeft ? crop.width : 0)) / image.startPosition.width;

    const newDistToLeft = image.width * relativeLeft;
    image.y = image.startPosition.y + diffTop;
    image.x = crop.x + (isCenter ? crop.width / 2 : isLeft ? crop.width : 0) - newDistToLeft;
  }
};
