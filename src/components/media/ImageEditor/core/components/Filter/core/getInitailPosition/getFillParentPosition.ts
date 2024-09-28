// import { getDistanceToCenter } from '../../../Crop/core/calculations/maxDistance/distToCenter';
// import { ICropShape, IDimension, IImageShape, IPosition } from '../../../../types/interfaces';
// import { getDistanceToRotatedAxis } from '../../../../calculationFunctions/distances';

// export const getFillParentPosition = (O: IPosition, crop: ICropShape, image: IImageShape, parentSize: IDimension) => {
//   //Calculating new selection position/size

//   const parentWidth = parentSize.width;
//   const parentHeight = parentSize.height;
//   const canvasAR = parentWidth / parentHeight;
//   const cropAR = crop.width / crop.height;

//   const newCrop = {
//     x: 0,
//     y: 0,
//     width: 0,
//     height: 0,
//   };

//   //Calculating new Selection size to fill Parent size
//   if (canvasAR > cropAR) {
//     newCrop.width = parentHeight * cropAR;
//     newCrop.height = parentHeight;
//   } else {
//     newCrop.width = parentWidth;
//     newCrop.height = parentWidth / cropAR;
//   }

//   //Calculating new Selection position to center of Parent
//   newCrop.x = O.x - newCrop.width / 2;
//   newCrop.y = O.y - newCrop.height / 2;

//   //Calculating new image position and size
//   const relativePosition = {
//     x: (crop.x - image.x) / image.width,
//     y: (crop.y - image.y) / image.height,
//     width: crop.width / image.width,
//     height: crop.height / image.height,
//   };

//   //New image position and size
//   const newImage = {
//     width: newCrop.width / relativePosition.width,
//     height: newCrop.height / relativePosition.height,
//     x: newCrop.x - (newCrop.width / relativePosition.width) * relativePosition.x,
//     y: newCrop.y - (newCrop.height / relativePosition.height) * relativePosition.y,
//   };

//   // When image is ROTATED
//   if (image.angle) {
//     //Calculating distance from Selection to Selection X/Y Aixs
//     const sDistanceToSAxis = {
//       x: crop.x + crop.width / 2 - O.x,
//       y: crop.y + crop.height / 2 - O.y,
//     };

//     //If selection isn't on center
//     if (sDistanceToSAxis.x !== 0 || sDistanceToSAxis.y !== 0) {
//       //Calculating distance from Image to Image X/Y Aixs (Rotated)
//       const iDistanceToIAxis = getDistanceToCenter(image, O);

//       //Calculating distance from Selection center to Image X/Y Aixs (Rotated) - to calculate relative distance
//       const sDistanceToIAxis = getDistanceToRotatedAxis(sDistanceToSAxis, image.angle);

//       //Calculating relative distance based on distance from Selection to Image X/Y Aixs (Rotated)
//       relativePosition.x = (iDistanceToIAxis.left + sDistanceToIAxis.x) / image.width;
//       relativePosition.y = (iDistanceToIAxis.top + sDistanceToIAxis.y) / image.height;

//       //Calculating new distance bsed on relative distance
//       const newDistance = {
//         x: newImage.width * relativePosition.x,
//         y: newImage.height * relativePosition.y,
//       };

//       //Calculating new image position based on new distance
//       newImage.x = O.x - newDistance.x;
//       newImage.y = O.y - newDistance.y;
//     }
//   }

//   return {
//     crop: newCrop,
//     image: newImage,
//   };
// };

import { getDistanceToCenter } from '../../../Crop/core/calculations/maxDistance/distToCenter';
import { ICropShape, IDimension, IImageShape, IPosition } from '../../../../types/interfaces';
import { getDistanceToRotatedAxis } from '../../../../calculationFunctions/distances';

export const getFillParentPosition = (O: IPosition, crop: ICropShape, image: IImageShape, parentSize: IDimension) => {
  //Calculating new selection position/size

  const parentWidth = parentSize.width;
  const parentHeight = parentSize.height;
  const canvasAR = parentWidth / parentHeight;
  const cropAR = crop.width / crop.height;

  const newCrop = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  //Calculating new Selection size to fill Parent size
  if (canvasAR > cropAR) {
    newCrop.width = parentHeight * cropAR;
    newCrop.height = parentHeight;
  } else {
    newCrop.width = parentWidth;
    newCrop.height = parentWidth / cropAR;
  }

  //Calculating new Selection position to center of Parent
  newCrop.x = O.x - newCrop.width / 2;
  newCrop.y = O.y - newCrop.height / 2;

  //Calculating new image position and size
  const relativePosition = {
    x: (crop.x - image.x) / image.width,
    y: (crop.y - image.y) / image.height,
    width: crop.width / image.width,
    height: crop.height / image.height,
  };

  //New image position and size
  const newImage = {
    width: newCrop.width / relativePosition.width,
    height: newCrop.height / relativePosition.height,
    x: newCrop.x - (newCrop.width / relativePosition.width) * relativePosition.x,
    y: newCrop.y - (newCrop.height / relativePosition.height) * relativePosition.y,
  };

  // When image is ROTATED
  if (image.angle) {
    //Calculating distance from Selection to Selection X/Y Aixs
    const sDistanceToSAxis = {
      x: crop.x + crop.width / 2 - O.x,
      y: crop.y + crop.height / 2 - O.y,
    };

    //If selection isn't on center
    if (sDistanceToSAxis.x !== 0 || sDistanceToSAxis.y !== 0) {
      //Calculating distance from Image to Image X/Y Aixs (Rotated)
      const iDistanceToIAxis = getDistanceToCenter(image, O);

      //Calculating distance from Selection center to Image X/Y Aixs (Rotated) - to calculate relative distance
      const sDistanceToIAxis = getDistanceToRotatedAxis(sDistanceToSAxis, image.angle);

      //Calculating relative distance based on distance from Selection to Image X/Y Aixs (Rotated)
      relativePosition.x = (iDistanceToIAxis.left + sDistanceToIAxis.x) / image.width;
      relativePosition.y = (iDistanceToIAxis.top + sDistanceToIAxis.y) / image.height;

      //Calculating new distance bsed on relative distance
      const newDistance = {
        x: newImage.width * relativePosition.x,
        y: newImage.height * relativePosition.y,
      };

      //Calculating new image position based on new distance
      newImage.x = O.x - newDistance.x;
      newImage.y = O.y - newDistance.y;
    }
  }

  return {
    crop: newCrop,
    image: newImage,
  };
};
