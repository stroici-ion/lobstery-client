import { IEditorStep, IMarkupLine, IPosition } from '../../../../Types/Interfaces';
import { getRelativePoint } from './getRelativePoint';

export const getRelativeLine = (line: IMarkupLine, cropState: IEditorStep) => {
  const O = cropState.Origin;
  const image = cropState.image;
  const image_O = {
    x: O.x - image.x,
    y: O.y - image.y,
  };

  const relativeLine: IPosition[] = [];

  if (line.arrowsLines.end.length) {
    const left = getRelativePoint(line.arrowsLines.end[0], O, image, image_O);
    const right = getRelativePoint(line.arrowsLines.end[1], O, image, image_O);
    line.relativeArrowsLines.end = [left, right];
  }

  if (line.arrowsLines.start.length) {
    const left = getRelativePoint(line.arrowsLines.start[0], O, image, image_O);
    const right = getRelativePoint(line.arrowsLines.start[1], O, image, image_O);
    line.relativeArrowsLines.start = [left, right];
  }

  for (let i = 0; i < line.line.length; i++) {
    const p = getRelativePoint(line.line[i], O, image, image_O);
    relativeLine[i] = p;
  }

  line.relativeLine = relativeLine;
};
