import { IMarkupLine, IPosition } from '../../../../Types/Interfaces';

// Function to calculate the distance between a point and a line segment
export function pointToLineDistance(point: IPosition, lineStart: IPosition, lineEnd: IPosition) {
  const { x: px, y: py } = point;
  const { x: x1, y: y1 } = lineStart;
  const { x: x2, y: y2 } = lineEnd;

  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0)
    // in case of 0 length line
    param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
}
// Function to remove lines within a certain radius of a point
export function removeLinesWithinRadius(lines: IMarkupLine[], erasePoint: IPosition, radius: number) {
  return lines.filter((l) => {
    for (let i = 0; i < l.relativeLine.length - 1; i++) {
      const line = l.relativeLine;
      const lineStart = {
        x: line[i].x * 100,
        y: line[i].y * 100,
      };

      const lineEnd = {
        x: line[i + 1].x * 100,
        y: line[i + 1].y * 100,
      };
      const ep = {
        x: erasePoint.x * 100,
        y: erasePoint.y * 100,
      };

      const distance = pointToLineDistance(ep, lineStart, lineEnd);
      if (distance <= radius) {
        return false; // Exclude line if any segment falls within radius
      }
    }
    return true; // Include line if no segment falls within radius
  });
}
