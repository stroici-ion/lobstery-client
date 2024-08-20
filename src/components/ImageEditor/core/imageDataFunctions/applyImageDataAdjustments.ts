import { IAdjustments } from '../types/interfaces';

export const applyImageDataAdjustments = (
  sourceImageData: ImageData,
  adjustmentsImageData: ImageData,
  adjustments: IAdjustments,
  applyFilterCallback?: (r: number, g: number, b: number) => number[],
  filterImageData?: ImageData
) => {
  const data = sourceImageData.data;
  const { brightness, contrast, warmth, tint, saturation, exposure, shadows, highlights } = adjustments;

  // Constants for saturation adjustment
  const sv = saturation / 100 + 1;
  const luR = 0.3086;
  const luG = 0.6094;
  const luB = 0.082;
  const az = (1 - sv) * luR + sv;
  const bz = (1 - sv) * luG;
  const cz = (1 - sv) * luB;
  const dz = (1 - sv) * luR;
  const ez = (1 - sv) * luG + sv;
  const fz = (1 - sv) * luB;
  const gz = (1 - sv) * luR;
  const hz = (1 - sv) * luG;
  const iz = (1 - sv) * luB + sv;

  // Precompute adjustment factors
  const brightnessAdjustment = (brightness / 4) * 2.55;
  const contrastFactor = contrast / 2 / 100;
  const contrastAdjustment = (259 * (contrastFactor + 1)) / (255 * (1 - contrastFactor));
  const exposureFactor = Math.pow(2, exposure / 100);
  const highlightsFactor = highlights > 0 ? highlights / 100 : highlights / 200;
  const shadowsFactor = shadows / 100;
  const warmthAdjustment = warmth / 4 / 100;
  const tintAdjustment = tint / 8 / 100;

  // Apply adjustments in a single loop
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    let a = data[i + 3];

    // Apply adjustments sequentially
    if (brightness) {
      r += brightnessAdjustment;
      g += brightnessAdjustment;
      b += brightnessAdjustment;
    }

    if (contrast) {
      r = contrastAdjustment * (r - 128) + 128;
      g = contrastAdjustment * (g - 128) + 128;
      b = contrastAdjustment * (b - 128) + 128;
    }

    if (exposure) {
      r *= exposureFactor;
      g *= exposureFactor;
      b *= exposureFactor;
    }

    if (highlights) {
      const luminance = getLuminance(r, g, b);
      const highlightBoost = 1 + highlightsFactor * (luminance / 255);
      r *= highlightBoost;
      g *= highlightBoost;
      b *= highlightBoost;
    }

    if (shadows) {
      const luminance = getLuminance(r, g, b);
      const shadowBoost = 1 + shadowsFactor * ((255 - luminance) / 255);
      r *= shadowBoost;
      g *= shadowBoost;
      b *= shadowBoost;
    }

    if (warmth) {
      r += r * warmthAdjustment;
      b -= b * warmthAdjustment;
    }

    if (tint) {
      r += r * tintAdjustment;
      g -= g * tintAdjustment;
    }

    if (saturation) {
      const saturatedRed = az * r + bz * g + cz * b;
      const saturatedGreen = dz * r + ez * g + fz * b;
      const saturatedBlue = gz * r + hz * g + iz * b;
      r = saturatedRed;
      g = saturatedGreen;
      b = saturatedBlue;
    }

    r = clamp(r);
    g = clamp(g);
    b = clamp(b);

    adjustmentsImageData.data[i] = r;
    adjustmentsImageData.data[i + 1] = g;
    adjustmentsImageData.data[i + 2] = b;
    adjustmentsImageData.data[i + 3] = a;

    if (applyFilterCallback && filterImageData) {
      const result = applyFilterCallback(r, g, b);
      filterImageData.data[i] = result[0];
      filterImageData.data[i + 1] = result[1];
      filterImageData.data[i + 2] = result[2];
      filterImageData.data[i + 3] = a;
    }
  }
};

// @ts-ignore
// Clamp function to ensure values are within [0, 255]
const clamp = (value) => {
  return Math.max(0, Math.min(255, value));
};

// @ts-ignore
function getLuminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}
