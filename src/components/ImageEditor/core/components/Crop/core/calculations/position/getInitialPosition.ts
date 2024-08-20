import { updateStartPosition } from '../../resetFunctions/updateStartPosition';
import { adjustShapePostion } from '../resizeCrop/resizeCropFreeAR';
import { IEditorStep } from '../../../../../types/interfaces';
import { iEBSB, iEBSLR, iEBST } from '../../../../../consts';

const getInitialPosition = (cropStep: IEditorStep) => {
  const parentSize = cropStep.parentSize;
  const imageOriginalSize = cropStep.imageOriginalSize;
  const image = cropStep.image;
  const crop = cropStep.crop;

  const parentWidth = parentSize.width - iEBSLR * 2;
  const parentHeight = parentSize.height - iEBST - iEBSB;

  const canvasAspectRatio = parentWidth / parentHeight;

  image.aspectRatio = imageOriginalSize.width / imageOriginalSize.height;
  //Calculating new Selection size to fill Parent size
  if (canvasAspectRatio > image.aspectRatio) {
    image.width = parentHeight * image.aspectRatio;
    image.height = parentHeight;
  } else {
    image.width = parentWidth;
    image.height = parentWidth / image.aspectRatio;
  }

  //Calculating new Selection position to center of Parent
  image.x = (parentWidth - image.width) / 2 + iEBSLR;
  image.y = (parentHeight - image.height) / 2 + iEBST;

  crop.x = image.x;
  crop.y = image.y;
  crop.width = image.width;
  crop.height = image.height;

  adjustShapePostion(image);
  adjustShapePostion(crop);

  updateStartPosition([image, crop]);
};

export default getInitialPosition;
