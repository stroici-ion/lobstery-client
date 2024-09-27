import { dpr, iEBSB, iEBST } from '../../../../consts';
import { IEditorStep } from '../../../../types/interfaces';

export const initailPostitionLoad = (
  cropStep: IEditorStep,
  imageRef: HTMLImageElement,
  imageCanvas: HTMLCanvasElement,
  cropCanvas: HTMLCanvasElement,
  parentDiv: HTMLDivElement
) => {
  cropStep.imageOriginalSize.width = imageRef.width;
  cropStep.imageOriginalSize.height = imageRef.height;

  imageCanvas.style.width = cropCanvas.style.width = parentDiv.offsetWidth + 'px';
  imageCanvas.style.height = cropCanvas.style.height = parentDiv.offsetHeight + 'px';

  imageCanvas.width = cropCanvas.width = parentDiv.offsetWidth * dpr;
  imageCanvas.height = cropCanvas.height = parentDiv.offsetHeight * dpr;

  cropStep.parentSize.width = imageCanvas.width;
  cropStep.parentSize.height = imageCanvas.height;

  cropStep.Origin.x = ~~(imageCanvas.width / 2);
  cropStep.Origin.y = iEBST + ~~((imageCanvas.height - iEBST - iEBSB) / 2);
};
