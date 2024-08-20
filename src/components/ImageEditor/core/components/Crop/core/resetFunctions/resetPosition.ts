import { IDynamicShape } from '../../../../types/interfaces';

export const resetPosition = (shapes: IDynamicShape[]) => {
  shapes.forEach((shape) => {
    shape.x = shape.startPosition.x;
    shape.y = shape.startPosition.y;
    shape.width = shape.startPosition.width;
    shape.height = shape.startPosition.height;
  });
};
