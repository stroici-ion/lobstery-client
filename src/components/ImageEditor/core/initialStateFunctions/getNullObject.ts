import { EnumAspectRatios, EnumMoveTypes } from '../types/enumerations';
import { IEditorStep } from '../types/interfaces';

export const getNullObject = () => {
  return {
    imageOriginalSize: { width: 0, height: 0 },
    activeActions: {
      moveType: EnumMoveTypes.default,
      isCroping: false,
      isChangingAngle: false,
      isZooming: false,
      isChangingAspectRatio: false,
      isAnimation: false,
    },
    Origin: { x: 0, y: 0 },
    crop: {
      aspectRatioId: EnumAspectRatios.free,
      aspectRatio: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      startPosition: { x: 0, y: 0, width: 0, height: 0 },
    },
    image: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      startPosition: { x: 0, y: 0, width: 0, height: 0 },
      angle: 0,
      cropCenter: { x: 0, y: 0 },
      aspectRatio: 1,
      flipped: { vertical: false, horizontal: false },
      rotated: 0,
      outerImage: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        startPosition: { x: 0, y: 0, width: 0, height: 0 },
        ratio: 0,
      },
    },
    maxDistance: {
      image: { left: 0, top: 0, right: 0, bottom: 0 },
      maxOverBorderRatio: { left: 100, top: 100, right: 100, bottom: 100 },
      outerImage: { left: 0, top: 0, right: 0, bottom: 0 },
      view: { left: 0, top: 0, right: 0, bottom: 0 },
    },
    angle: {
      angle: 0,
      startAngle: 0,
      startCursor: 0,
      ratio: { x: 0, y: 0, width: 0, height: 0 },
    },
    zoom: { step: 0, inSteps: [], outSteps: [] },
    aspectRatioStartPosition: {
      crop: { x: 0, y: 0, width: 0, height: 0 },
      image: { x: 0, y: 0, width: 0, height: 0 },
    },
    parentSize: { width: 0, height: 0 },
  } as IEditorStep;
};
