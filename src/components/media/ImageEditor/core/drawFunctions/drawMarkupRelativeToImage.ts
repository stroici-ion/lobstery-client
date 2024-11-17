import { IMarkupLine, IPosition } from '../../types/interfaces';

export const drawMarkupRelativeToImage = (ctx: CanvasRenderingContext2D, lines: IMarkupLine[], rotated: number) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  lines.forEach((l) => {
    // const brushSizeDimension = rotated % 2 === 0 ? ctx.canvas.width : ctx.canvas.height;
    ctx.lineWidth = Math.abs(l.relativeSize * ctx.canvas.width);
    ctx.strokeStyle = l.brush.color;
    ctx.beginPath();

    //Due to flipping and rotating image, markup lines position must be changed to match initial position
    const getPointPosition = (point: IPosition) => {
      const result = {
        x: ctx.canvas.width * point.x,
        y: ctx.canvas.height * point.y,
      };

      return result;
    };

    const line = l.relativeLine;
    const fisrtPoint = getPointPosition(line[0]);
    ctx.moveTo(fisrtPoint.x, fisrtPoint.y);

    // Drawing Lines
    for (let i = 0; i < line.length; i++) {
      const point = getPointPosition(line[i]);
      ctx.lineTo(point.x, point.y);
    }

    // Drawing Arrows
    if (l.relativeArrowsLines.end.length) {
      const lastPoint = getPointPosition(line[line.length - 1]);
      const left = getPointPosition(l.relativeArrowsLines.end[0]);
      const right = getPointPosition(l.relativeArrowsLines.end[1]);
      ctx.moveTo(left.x, left.y);
      ctx.lineTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(right.x, right.y);
    }

    if (l.relativeArrowsLines.start.length) {
      const lastPoint = getPointPosition(line[0]);
      const left = getPointPosition(l.relativeArrowsLines.start[0]);
      const right = getPointPosition(l.relativeArrowsLines.start[1]);
      ctx.moveTo(left.x, left.y);
      ctx.lineTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(right.x, right.y);
    }

    ctx.stroke();
    ctx.closePath();
  });
};
