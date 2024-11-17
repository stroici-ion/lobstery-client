import { IMarkupLine } from '../../../../../types/interfaces';

export const eraseAll = (ctx: CanvasRenderingContext2D, lines: React.MutableRefObject<IMarkupLine[]>) => {
  if (ctx) {
    lines.current = [] as IMarkupLine[];
  }
};
