import { getDistanceToCenter } from '../components/Crop/core/calculations/maxDistance/distToCenter';
import { IEditorStep } from '../Types/Interfaces';

export const getEditedImageShape = (cropStep: IEditorStep) => {
  const image = cropStep.image;
  const Origin = cropStep.Origin;

  const centerX = Origin.x;
  const centerY = Origin.y;

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

  if (editedShape.angle) {
    editedShape.rotateX = centerX;
    editedShape.rotateY = centerY;
  }

  if (image.rotated % 2 !== 0) {
    if (image.flipped.horizontal) {
      editedShape.scaleV *= -1;
      editedShape.y *= -1;
      editedShape.height *= -1;
      editedShape.rotateY *= -1;
    }

    if (image.flipped.vertical) {
      editedShape.scaleH *= -1;
      editedShape.x *= -1;
      editedShape.width *= -1;
      editedShape.rotateX *= -1;
    }
  } else {
    if (image.flipped.horizontal) {
      editedShape.scaleH *= -1;
      editedShape.x *= -1;
      editedShape.width *= -1;
      editedShape.rotateX *= -1;
    }

    if (image.flipped.vertical) {
      editedShape.scaleV *= -1;
      editedShape.y *= -1;
      editedShape.height *= -1;
      editedShape.rotateY *= -1;
    }
  }

  return editedShape;
};
