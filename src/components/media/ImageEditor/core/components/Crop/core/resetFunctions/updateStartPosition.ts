import { IDynamicShape } from '../../../../../types/interfaces';

export const updateStartPosition = (shapes: IDynamicShape[]) => {
  shapes.forEach((shape) => {
    shape.startPosition.x = shape.x;
    shape.startPosition.y = shape.y;
    shape.startPosition.width = shape.width;
    shape.startPosition.height = shape.height;
  });
};
