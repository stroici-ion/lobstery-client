import { IEditorStep } from '../../../../../types/interfaces';

const cloneHistoryStep = (cropState: IEditorStep, step: string) => {
  const newObject = JSON.parse(step) as IEditorStep;

  cropState.activeActions = {
    ...newObject.activeActions,
  };

  cropState.crop = {
    ...newObject.crop,
    startPosition: { ...newObject.crop.startPosition },
  };

  cropState.image = {
    ...newObject.image,
    startPosition: { ...newObject.image.startPosition },
    cropCenter: { ...newObject.image.cropCenter },
    flipped: { ...newObject.image.flipped },
    outerImage: {
      ...newObject.image.outerImage,
      startPosition: { ...newObject.image.outerImage.startPosition },
    },
  };

  cropState.maxDistance = {
    image: { ...newObject.maxDistance.image },
    maxOverBorderRatio: { ...newObject.maxDistance.maxOverBorderRatio },
    outerImage: { ...newObject.maxDistance.outerImage },
    view: { ...newObject.maxDistance.view },
  };

  cropState.angle = {
    ...newObject.angle,
    ratio: { ...newObject.angle.ratio },
  };

  cropState.zoom = {
    step: newObject.zoom.step,
    inSteps: [...newObject.zoom.inSteps],
    outSteps: [...newObject.zoom.outSteps],
  };

  cropState.aspectRatioStartPosition = {
    crop: { ...newObject.aspectRatioStartPosition.crop },
    image: { ...newObject.aspectRatioStartPosition.image },
  };
};

export default cloneHistoryStep;
