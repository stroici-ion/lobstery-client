export function simplifyLine(points: number[][], tolerance: number) {
  if (points.length <= 2) {
    return points;
  }

  // Find the point with the maximum distance
  let maxDistance = 0;
  let maxIndex = 0;
  const [startX, startY] = points[0];
  const [endX, endY] = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(points[i], [startX, startY], [endX, endY]);
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }

  // If max distance is greater than tolerance, recursively simplify
  if (maxDistance > tolerance) {
    const leftPart: number[][] = simplifyLine(points.slice(0, maxIndex + 1), tolerance);
    const rightPart: number[][] = simplifyLine(points.slice(maxIndex), tolerance).slice(1); // Exclude the duplicate point
    return leftPart.concat(rightPart);
  } else {
    // Return the start and end points only
    return [points[0], points[points.length - 1]];
  }
}

// Function to calculate perpendicular distance from a point to a line
function perpendicularDistance(point: number[], lineStart: number[], lineEnd: number[]) {
  const [x, y] = point;
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;

  const numerator = Math.abs((x2 - x1) * (y1 - y) - (x1 - x) * (y2 - y1));
  const denominator = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  return numerator / denominator;
}
