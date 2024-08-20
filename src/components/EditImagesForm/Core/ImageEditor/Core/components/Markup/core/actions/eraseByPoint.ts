import { IMarkupLine, IPosition } from '../../../../Types/Interfaces';
import { removeLinesWithinRadius } from '../functions/eraseLines';

export const eraseByPoint = (ctx: CanvasRenderingContext2D, lines: React.MutableRefObject<IMarkupLine[]>, point: IPosition) => {
  if (ctx) {
    lines.current = removeLinesWithinRadius(lines.current, point, 1);
  }
};
