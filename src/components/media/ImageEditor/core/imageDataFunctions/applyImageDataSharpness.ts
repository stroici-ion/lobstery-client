export const applyImageDataSharpness = (sharpness: number, imageData: ImageData) => {
  const cwidth = imageData.width;
  const cheight = imageData.height;
  const sharpenessAdjustment = sharpness / 10;

  var x,
    sx,
    sy,
    r,
    g,
    b,
    a,
    dstOff,
    srcOff,
    wt,
    cx,
    cy,
    scy,
    scx,
    weights = [0, -1, 0, -1, 5, -1, 0, -1, 0],
    katet = Math.round(Math.sqrt(weights.length)),
    half = (katet * 0.5) | 0,
    dstData = new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height),
    dstBuff = dstData.data,
    srcBuff = imageData.data,
    y = cheight;
  while (y--) {
    x = cwidth;
    while (x--) {
      sy = y;
      sx = x;
      dstOff = (y * cwidth + x) * 4;
      r = 0;
      g = 0;
      b = 0;
      a = 0;
      if (x > 0 && y > 0 && x < cwidth - 1 && y < cheight - 1) {
        for (cy = 0; cy < katet; cy++) {
          for (cx = 0; cx < katet; cx++) {
            scy = sy + cy - half;
            scx = sx + cx - half;

            if (scy >= 0 && scy < cheight && scx >= 0 && scx < cwidth) {
              srcOff = (scy * cwidth + scx) * 4;
              wt = weights[cy * katet + cx];

              r += srcBuff[srcOff] * wt;
              g += srcBuff[srcOff + 1] * wt;
              b += srcBuff[srcOff + 2] * wt;
              a += srcBuff[srcOff + 3] * wt;
            }
          }
        }

        dstBuff[dstOff] = r * sharpenessAdjustment + srcBuff[dstOff] * (1 - sharpenessAdjustment);
        dstBuff[dstOff + 1] = g * sharpenessAdjustment + srcBuff[dstOff + 1] * (1 - sharpenessAdjustment);
        dstBuff[dstOff + 2] = b * sharpenessAdjustment + srcBuff[dstOff + 2] * (1 - sharpenessAdjustment);
        dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
      } else {
        dstBuff[dstOff] = srcBuff[dstOff];
        dstBuff[dstOff + 1] = srcBuff[dstOff + 1];
        dstBuff[dstOff + 2] = srcBuff[dstOff + 2];
        dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
      }
    }
  }

  return dstData;
};
