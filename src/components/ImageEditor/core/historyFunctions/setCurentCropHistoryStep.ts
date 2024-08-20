import { ICropHistory } from '../types/interfaces';

export const setCurentCropHistoryStep = (curentHistoryStep: ICropHistory, historyStep: string) => {
  const historyStepValue = JSON.parse(historyStep) as ICropHistory;

  //Crop
  curentHistoryStep.flipped.horizontal = historyStepValue.flipped.horizontal;
  curentHistoryStep.flipped.vertical = historyStepValue.flipped.vertical;
  curentHistoryStep.rotated = historyStepValue.rotated;
  curentHistoryStep.imageAR = historyStepValue.imageAR;
  curentHistoryStep.angle = historyStepValue.angle;
  curentHistoryStep.cropARId = historyStepValue.cropARId;
  curentHistoryStep.cropAR = historyStepValue.cropAR;
  curentHistoryStep.cropLeft = historyStepValue.cropLeft;
  curentHistoryStep.cropTop = historyStepValue.cropTop;
  curentHistoryStep.cropWidth = historyStepValue.cropWidth;
  curentHistoryStep.cropHeight = historyStepValue.cropHeight;
};
