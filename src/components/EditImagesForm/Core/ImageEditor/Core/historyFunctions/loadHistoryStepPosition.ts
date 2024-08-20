import { getRotatedShape } from '../components/Crop/core/calculations/position/getRotatedShape';
import { ICropHistory, IEditorStep } from '../Types/Interfaces';
import {
  imageEditorBorderSizeLeftRight as iEBSLR,
  imageEditorBorderSizeTop as iEBST,
  imageEditorBorderSizeBottom as iEBSB,
} from '../../../../../../utils/consts';

export const loadHistoryStepPosition = (
  cropStep: IEditorStep,
  historyStep: ICropHistory,
  noBorders: boolean = false,
  recalculateCrop: boolean = true
) => {
  const Origin = cropStep.Origin;
  const parentSize = cropStep.parentSize;
  const crop = cropStep.crop;
  const image = cropStep.image;
  const angle = cropStep.angle;

  image.flipped.horizontal = historyStep.flipped.horizontal;
  image.flipped.vertical = historyStep.flipped.vertical;
  image.rotated = historyStep.rotated;
  angle.angle = historyStep.angle;
  image.angle = historyStep.angle;
  image.aspectRatio = historyStep.imageAR;
  crop.aspectRatioId = historyStep.cropARId;
  crop.aspectRatio = historyStep.cropAR;

  let parentWidth = parentSize.width;
  let parentHeight = parentSize.height;

  if (!noBorders) {
    parentWidth = parentSize.width - iEBSLR * 2;
    parentHeight = parentSize.height - iEBST - iEBSB;
  }

  if (recalculateCrop) {
    const canvasAspectRatio = parentWidth / parentHeight;

    //Calculating new Selection size to fill Parent size
    if (canvasAspectRatio > crop.aspectRatio) {
      crop.width = parentHeight * crop.aspectRatio;
      crop.height = parentHeight;
    } else {
      crop.width = parentWidth;
      crop.height = parentWidth / crop.aspectRatio;
    }
  }

  //Calculating new Selection position to center of Parent
  if (recalculateCrop) {
    crop.x = Origin.x - crop.width / 2;
    crop.y = Origin.y - crop.height / 2;
  } else {
    crop.x = 0;
    crop.y = 0;
  }

  let relativeCropWidth = crop.width;
  if (historyStep.angle) relativeCropWidth = getRotatedShape(crop, historyStep.angle).width;

  image.width = relativeCropWidth / historyStep.cropWidth;
  image.height = image.width / image.aspectRatio;

  image.x = Origin.x - image.width * historyStep.cropLeft;
  image.y = Origin.y - image.height * historyStep.cropTop;
};
