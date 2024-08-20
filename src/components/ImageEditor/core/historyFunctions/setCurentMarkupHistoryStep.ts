import { IEditorStep, IMarkupLine } from '../types/interfaces';

export const setCurentMarkupHistoryStep = (linesRef: React.MutableRefObject<IMarkupLine[]>, historyStep: string, cropStep: IEditorStep) => {
  const historyStepValue = JSON.parse(historyStep) as IMarkupLine[];

  historyStepValue.forEach((line) => {
    // line.line = getAbsoluteLine(line, cropStep);
    line.brush.size = line.relativeSize * cropStep.image.width;
  });

  linesRef.current = historyStepValue;
};
