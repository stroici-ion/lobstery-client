import { getFirtsHistoryStep } from '../../../../historyFunctions/getFirtsHistoryStep';
import { getRotatedShape } from '../calculations/position/getRotatedShape';
import { ICropHistory, IEditorStep } from '../../../../../types/interfaces';
import { EAspectRatios } from '../../../../../types/enums';
import { aspectRatioList } from '../../../AspectRatiosList';

export const getCurentHistoryStep = (cropStep: IEditorStep) => {
  const crop = cropStep.crop;
  const image = cropStep.image;
  const Origin = cropStep.Origin;
  const rotatedCropSize = getRotatedShape(crop, image.angle);

  const historyStep: ICropHistory = getFirtsHistoryStep(image.width, image.height);

  historyStep.flipped.horizontal = image.flipped.horizontal;
  historyStep.flipped.vertical = image.flipped.vertical;
  historyStep.rotated = image.rotated;
  historyStep.imageAR = cropStep.image.width / cropStep.image.height;

  const candidateAR = aspectRatioList.find((ar) => ar.id === crop.aspectRatioId);

  let cropAR = crop.width / crop.height;

  if (candidateAR) {
    if (candidateAR.id !== EAspectRatios.free) cropAR = candidateAR.value;
    if (candidateAR.id === EAspectRatios.original) cropAR = cropStep.image.aspectRatio;
  }

  const cropLeft = (Origin.x - image.x) / image.width;
  const cropTop = (Origin.y - image.y) / image.height;
  const cropWidth = rotatedCropSize.width / image.width;
  const cropHeight = rotatedCropSize.height / image.height;

  historyStep.angle = image.angle;
  historyStep.cropARId = crop.aspectRatioId;
  historyStep.cropAR = cropAR;
  historyStep.cropLeft = cropLeft;
  historyStep.cropTop = cropTop;
  historyStep.cropWidth = cropWidth;
  historyStep.cropHeight = cropHeight;

  return historyStep;
};
