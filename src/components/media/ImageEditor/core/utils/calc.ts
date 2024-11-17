import { IShape } from '../../types/interfaces';

export const r = (x: number) => Math.round(x);

export const adjustShapePostion = (shape: IShape) => {
  shape.x = Math.round(shape.x);
  shape.y = Math.round(shape.y);
  shape.width = Math.round(shape.width);
  shape.height = Math.round(shape.height);
};
