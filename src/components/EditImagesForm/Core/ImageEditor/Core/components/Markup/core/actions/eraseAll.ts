import { IMarkupLine } from '../../../../Types/Interfaces';

export const eraseAll = (ctx: CanvasRenderingContext2D, lines: React.MutableRefObject<IMarkupLine[]>) => {
  if (ctx) {
    lines.current = [] as IMarkupLine[];
  }
};
