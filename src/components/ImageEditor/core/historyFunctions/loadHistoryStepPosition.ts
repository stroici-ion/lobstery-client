import { getRotatedShape } from '../components/Crop/core/calculations/position/getRotatedShape';
import { ICropHistory, IEditorStep } from '../types/interfaces';
import { iEBSB, iEBSLR, iEBST, iESIPBS } from '../consts';
import { r } from '../utils/calc';

export const loadHistoryStepPosition = (
  cropStep: IEditorStep,
  historyStep: ICropHistory,
  bordesType: number = 0,
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

  if (!bordesType) {
    parentWidth = parentSize.width - iEBSLR * 2;
    parentHeight = parentSize.height - iEBST - iEBSB;
  }
  if (bordesType === 1) {
    parentWidth = parentSize.width - iESIPBS;
    parentHeight = parentSize.height - iESIPBS;
  }

  if (recalculateCrop) {
    const canvasAspectRatio = parentWidth / parentHeight;

    //Calculating new Selection size to fill Parent size
    if (canvasAspectRatio > crop.aspectRatio) {
      crop.width = r(parentHeight * crop.aspectRatio);
      crop.height = r(crop.width / crop.aspectRatio);
    } else {
      crop.width = parentWidth;
      crop.height = r(parentWidth / crop.aspectRatio);
    }
  }

  //Calculating new Selection position to center of Parent
  if (recalculateCrop) {
    crop.x = Origin.x - r(crop.width / 2);
    crop.y = Origin.y - r(crop.height / 2);
  } else {
    crop.x = 0;
    crop.y = 0;
  }

  let relativeCropWidth = crop.width;
  if (historyStep.angle) relativeCropWidth = getRotatedShape(crop, historyStep.angle).width;

  image.width = r(relativeCropWidth / historyStep.cropWidth);
  image.height = r(image.width / image.aspectRatio);

  image.x = Origin.x - r(image.width * historyStep.cropLeft);
  image.y = Origin.y - r(image.height * historyStep.cropTop);
};
