import { IEditorStep, IMarkupLine, IPosition, IShape } from '../Types/Interfaces';

export const drawMarkupRelativeToCanvas = (ctx: CanvasRenderingContext2D, lines: IMarkupLine[], eImg: IShape, cropState: IEditorStep) => {
  const image = cropState.image;
  const O = cropState.Origin;
  lines.forEach((l) => {
    const brushSizeDimension = image.rotated % 2 === 0 ? image.width : image.height;
    ctx.lineWidth = Math.abs(l.relativeSize * brushSizeDimension);
    ctx.strokeStyle = l.brush.color;
    ctx.beginPath();

    //Due to flipping and rotating image, markup lines position must be changed to match initial position
    const getPointPosition = (point: IPosition) => {
      const result = {
        x: eImg.x + eImg.width * point.x - O.x,
        y: eImg.y + eImg.height * point.y - O.y,
      };

      if (image.rotated % 2 === 0) {
        if (image.flipped.horizontal) result.x = O.x - (eImg.x + eImg.width * (1 - point.x));
        if (image.flipped.vertical) result.y = O.y - (eImg.y + eImg.height * (1 - point.y));
      } else {
        if (image.flipped.vertical) result.x = O.x - (eImg.x + eImg.width * (1 - point.x));
        if (image.flipped.horizontal) result.y = O.y - (eImg.y + eImg.height * (1 - point.y));
      }

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
