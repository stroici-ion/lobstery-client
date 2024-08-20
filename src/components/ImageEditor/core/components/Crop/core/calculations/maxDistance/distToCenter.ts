import { IPosition, IShape } from '../../../../../types/interfaces';

export const getDistanceToCenter = (shape: IShape, O: IPosition) => {
  const dist = {
    left: O.x - shape.x,
    top: O.y - shape.y,
  };

  return {
    ...dist,
    right: shape.width - dist.left,
    bottom: shape.height - dist.top,
  };
};
