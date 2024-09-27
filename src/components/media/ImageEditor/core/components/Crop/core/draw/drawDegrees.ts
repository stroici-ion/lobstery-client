import { dpr } from '../../../../config';

export const canvasDrawDegrees = (ctx: CanvasRenderingContext2D, angle: number, color: string) => {
  const gap = 15 * dpr;
  const centerX = 400 * dpr;
  const centerY = 40 * dpr;
  const rangeCenterX = 400 * dpr + angle * -gap;
  const rangeCenterY = 40 * dpr;

  ctx.clearRect(0, 0, 801 * dpr, 401 * dpr);
  ctx.fillStyle = color;
  ctx.font = '22px Arial';
  let titleX = centerX;
  if (angle >= 0) titleX = centerX - 4.5 * dpr;
  else titleX = centerX - 9 * dpr;
  ctx.fillText(`${angle} °`, titleX, centerY - 20 * dpr);

  ctx.font = '22px Times New Roman';
  ctx.fillText('0', rangeCenterX - 4 * dpr, rangeCenterY + 3 * dpr);

  const getColor = (x: number) => {
    if (x < 10 * dpr || x > 790 * dpr) return '0';
    if (x < 20 * dpr || x > 780 * dpr) return '0.1';
    if (x < 30 * dpr || x > 770 * dpr) return '0.2';
    if (x < 40 * dpr || x > 760 * dpr) return '0.3';
    if (x < 50 * dpr || x > 750 * dpr) return '0.4';
    if (x < 60 * dpr || x > 740 * dpr) return '0.5';
    if (x < 70 * dpr || x > 730 * dpr) return '0.6';
    if (x < 80 * dpr || x > 720 * dpr) return '0.7';
    return '0.8';
  };

  ctx.fillStyle = color;
  for (let i = 0; i < 45; i++) {
    if (i % 5 !== 0) {
      ctx.beginPath();
      const computedColor = color.replace('0.9', getColor(rangeCenterX - i * gap));
      ctx.fillStyle = computedColor;
      ctx.ellipse(rangeCenterX - i * gap - 1, rangeCenterY - 1, 3, 3, 0, 0, 360);
      ctx.fill();
    }
  }
  for (let i = 0; i < 45; i++) {
    ctx.fillStyle = '#aaaaaa22';
    if (i % 5 !== 0) {
      ctx.beginPath();
      const computedColor = color.replace('0.9', getColor(rangeCenterX + i * gap));
      ctx.fillStyle = computedColor;
      ctx.ellipse(rangeCenterX + i * gap + 1, rangeCenterY - 1, 3, 3, 0, 0, 360);
      ctx.fill();
      ctx.closePath();
    }
  }

  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  for (let i = 1; i <= 45; i++) {
    if (i % 5 === 0) {
      ctx.beginPath();
      const computedColor = color.replace('0.9', getColor(rangeCenterX - i * gap));
      ctx.strokeStyle = computedColor;
      ctx.moveTo(rangeCenterX - i * gap - 1, rangeCenterY - 5 * dpr);
      ctx.lineTo(rangeCenterX - i * gap - 1, rangeCenterY + 3 * dpr);
      ctx.stroke();
      ctx.closePath();
    }
  }
  for (let i = 1; i <= 45; i++) {
    if (i % 5 === 0) {
      ctx.beginPath();
      const computedColor = color.replace('0.9', getColor(rangeCenterX + i * gap));
      ctx.strokeStyle = computedColor;
      ctx.moveTo(rangeCenterX + i * gap - 1, rangeCenterY - 5 * dpr);
      ctx.lineTo(rangeCenterX + i * gap - 1, rangeCenterY + 3 * dpr);
      ctx.stroke();
      ctx.closePath();
    }
  }
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 10 * dpr;
  ctx.moveTo(centerX, centerY - 10);
  ctx.lineTo(centerX, centerY + 10);
  ctx.stroke();
  ctx.closePath();
};
