import { IShape } from "../types/interfaces";

export const adjustShapePostion = (shape: IShape) => {
  shape.x = Math.floor(shape.x);
  shape.y = Math.floor(shape.y);
  shape.width = Math.ceil(shape.width);
  shape.height = Math.ceil(shape.height);
};
