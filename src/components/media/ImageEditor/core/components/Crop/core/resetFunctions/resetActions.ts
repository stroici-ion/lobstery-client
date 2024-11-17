import { IEditorStep } from '../../../../../types/interfaces';
import { EMoveTypes } from '../../../../../types/enums';

export const resetActions = (cropStep: IEditorStep) => {
  const crop = cropStep.crop;
  const image = cropStep.image;
  const zoom = cropStep.zoom;
  const aspectRatioStartPosition = cropStep.aspectRatioStartPosition;

  image.startPosition.x = image.x;
  image.startPosition.y = image.y;
  image.startPosition.width = image.width;
  image.startPosition.height = image.height;

  crop.startPosition.x = crop.x;
  crop.startPosition.y = crop.y;
  crop.startPosition.width = crop.width;
  crop.startPosition.height = crop.height;

  zoom.step = 0;
  zoom.inSteps = [];
  zoom.outSteps = [
    {
      stop: false,
      direction: EMoveTypes.default,
      ...image.startPosition,
      maxOverBorderRatio: {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100,
      },
      outer: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        ratio: 0,
      },
      isStartPosition: false,
    },
  ];

  aspectRatioStartPosition.image.x = image.x;
  aspectRatioStartPosition.image.y = image.y;
  aspectRatioStartPosition.image.width = image.width;
  aspectRatioStartPosition.image.height = image.height;

  aspectRatioStartPosition.crop.x = crop.x;
  aspectRatioStartPosition.crop.y = crop.y;
  aspectRatioStartPosition.crop.width = crop.width;
  aspectRatioStartPosition.crop.height = crop.height;
};
