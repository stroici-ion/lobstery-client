import { dpr } from '../../../../consts';
import { IEditorStep } from '../../../../types/interfaces';

export const initailPostitionLoad = (
  cropStep: IEditorStep,
  imageRef: HTMLImageElement,
  canvas: HTMLCanvasElement,
  markupCanvas: HTMLCanvasElement,
  parentDiv: HTMLDivElement
) => {
  cropStep.imageOriginalSize.width = imageRef.width;
  cropStep.imageOriginalSize.height = imageRef.height;

  markupCanvas.style.width = canvas.style.width = parentDiv.offsetWidth + 'px';
  markupCanvas.style.height = canvas.style.height = parentDiv.offsetHeight + 'px';

  markupCanvas.width = canvas.width = parentDiv.offsetWidth * dpr;
  markupCanvas.height = canvas.height = parentDiv.offsetHeight * dpr;

  cropStep.parentSize.width = canvas.width;
  cropStep.parentSize.height = canvas.height;

  cropStep.Origin.x = canvas.width / 2;
  cropStep.Origin.y = canvas.height / 2;
};
