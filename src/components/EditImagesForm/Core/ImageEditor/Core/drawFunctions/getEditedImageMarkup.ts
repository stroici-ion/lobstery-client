import { getDistanceToCenter } from '../components/Crop/core/calculations/maxDistance/distToCenter';
import { IEditorStep } from '../Types/Interfaces';

export const getEditedImageMarkup = (cropStep: IEditorStep) => {
  const image = cropStep.image;
  const Origin = cropStep.Origin;

  const editedShape = {
    angle: image.angle,
    x: image.x,
    y: image.y,
    width: image.width,
    height: image.height,
    scaleH: 1,
    scaleV: 1,
    rotateX: 0,
    rotateY: 0,
  };

  if (image.rotated !== 0) {
    const imageDC = getDistanceToCenter(image, Origin);
    let aux = 0;
    switch (image.rotated) {
      case 1:
        aux = editedShape.width;
        editedShape.width = editedShape.height;
        editedShape.height = aux;
        editedShape.x = Origin.x - imageDC.top;
        editedShape.y = Origin.y - imageDC.right;
        editedShape.angle += 90;
        break;
      case 2:
        editedShape.x = Origin.x - imageDC.right;
        editedShape.y = Origin.y - imageDC.bottom;
        editedShape.angle += 180;
        break;
      case 3:
        aux = editedShape.width;
        editedShape.width = editedShape.height;
        editedShape.height = aux;
        editedShape.x = Origin.x - imageDC.bottom;
        editedShape.y = Origin.y - imageDC.left;
        editedShape.angle += 270;
        break;
    }
  }

  return editedShape;
};
