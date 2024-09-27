import { dpr } from '../../../../config';
import { IEditorStep } from '../../../../types/interfaces';

export const initailPostitionLoad = (
  cropStep: IEditorStep,
  i: HTMLImageElement,
  ic: HTMLCanvasElement,
  mc: HTMLCanvasElement,
  pc: HTMLCanvasElement,
  pd: HTMLDivElement
) => {
  cropStep.imageOriginalSize.width = i.width;
  cropStep.imageOriginalSize.height = i.height;

  ic.width = mc.width = pc.width = pd.offsetWidth * dpr;
  ic.height = mc.height = pc.height = pd.offsetHeight * dpr;

  ic.style.width = mc.style.width = pc.style.width = pd.offsetWidth + 'px';
  ic.style.height = mc.style.height = pc.style.height = pd.offsetHeight + 'px';

  cropStep.parentSize.width = ic.width;
  cropStep.parentSize.height = ic.height;

  cropStep.Origin.x = ic.width / 2;
  cropStep.Origin.y = ic.height / 2;
};
