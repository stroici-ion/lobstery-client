const luR = 0.3086;
const luG = 0.6094;
const luB = 0.082;

function clamp(value: number) {
  return Math.max(0, Math.min(255, value));
}

export function goldenFilter(intensityFactor: number, d?: Uint8ClampedArray, r?: Uint8ClampedArray) {
  const redAdjust = (30 / 100) * intensityFactor;
  const greenAdjust = (30 / 100) * intensityFactor;
  const blueAdjust = (-20 / 100) * intensityFactor;

  const result = r && d ? r : d ? d : undefined;

  if (d && result)
    for (let i = 0; i < d.length; i += 4) {
      result[i] = clamp(d[i] + redAdjust);
      result[i + 1] = clamp(d[i + 1] + greenAdjust);
      result[i + 2] = clamp(d[i + 2] + blueAdjust);
    }

  return (r: number, g: number, b: number) => [clamp(r + redAdjust), clamp(g + greenAdjust), clamp(b + blueAdjust)];
}

export function punchFilter(intensityFactor: number, d?: Uint8ClampedArray, r?: Uint8ClampedArray) {
  const brightnessAdjustment = (20 / 100) * intensityFactor;
  const sv = (0.3 / 100) * intensityFactor + 1;
  const contrastLevel = 1 + (0.3 / 100) * intensityFactor;
  const greenAdjust = (0.6 / 100) * intensityFactor;
  const blueAdjust = (-1 / 100) * intensityFactor;

  const az = (1 - sv) * luR + sv;
  const bz = (1 - sv) * luG;
  const cz = (1 - sv) * luB;
  const dz = (1 - sv) * luR;
  const ez = (1 - sv) * luG + sv;
  const fz = (1 - sv) * luB;
  const gz = (1 - sv) * luR;
  const hz = (1 - sv) * luG;
  const iz = (1 - sv) * luB + sv;

  const result = r && d ? r : d ? d : undefined;

  if (d && result)
    for (let i = 0; i < d.length; i += 4) {
      let r = d[i];
      let g = d[i + 1];
      let b = d[i + 2];
      const saturatedRed = az * r + bz * g + cz * b;
      const saturatedGreen = dz * r + ez * g + fz * b;
      const saturatedBlue = gz * r + hz * g + iz * b;

      r = clamp(contrastLevel * (saturatedRed - 128) + 128);
      g = clamp(contrastLevel * (saturatedGreen - 128) + 128);
      b = contrastLevel * (saturatedBlue - 128) + 128;

      result[i] = r + brightnessAdjustment;
      result[i + 1] = g + brightnessAdjustment + greenAdjust;
      result[i + 2] = b + brightnessAdjustment + blueAdjust;
    }

  return (r: number, g: number, b: number) => {
    r = r;
    g = g + greenAdjust;
    b = b + blueAdjust;
    const saturatedRed = az * r + bz * g + cz * b;
    const saturatedGreen = dz * r + ez * g + fz * b;
    const saturatedBlue = gz * r + hz * g + iz * b;

    r = clamp(contrastLevel * (saturatedRed - 128) + 128);
    g = clamp(contrastLevel * (saturatedGreen - 128) + 128);
    b = contrastLevel * (saturatedBlue - 128) + 128;

    return [r + brightnessAdjustment, g + brightnessAdjustment, b + brightnessAdjustment];
  };
}

export function radiateFilter(intensityFactor: number, d?: Uint8ClampedArray, r?: Uint8ClampedArray) {
  const brightnessAdjustment = (30 / 100) * intensityFactor;
  const contrastLevel = 1 + (0.2 / 100) * intensityFactor;
  const sv = (0.5 / 100) * intensityFactor + 1;

  const az = (1 - sv) * luR + sv;
  const bz = (1 - sv) * luG;
  const cz = (1 - sv) * luB;
  const dz = (1 - sv) * luR;
  const ez = (1 - sv) * luG + sv;
  const fz = (1 - sv) * luB;
  const gz = (1 - sv) * luR;
  const hz = (1 - sv) * luG;
  const iz = (1 - sv) * luB + sv;

  const result = r && d ? r : d ? d : undefined;

  if (d && result)
    for (let i = 0; i < d.length; i += 4) {
      let r = d[i];
      let g = d[i + 1];
      let b = d[i + 2];
      const saturatedRed = az * r + bz * g + cz * b;
      const saturatedGreen = dz * r + ez * g + fz * b;
      const saturatedBlue = gz * r + hz * g + iz * b;

      r = clamp(contrastLevel * (saturatedRed - 128) + 128);
      g = clamp(contrastLevel * (saturatedGreen - 128) + 128);
      b = contrastLevel * (saturatedBlue - 128) + 128;

      result[i] = r + brightnessAdjustment;
      result[i + 1] = g + brightnessAdjustment;
      result[i + 2] = b + brightnessAdjustment;
    }

  return (r: number, g: number, b: number) => {
    const saturatedRed = az * r + bz * g + cz * b;
    const saturatedGreen = dz * r + ez * g + fz * b;
    const saturatedBlue = gz * r + hz * g + iz * b;

    r = clamp(contrastLevel * (saturatedRed - 128) + 128);
    g = clamp(contrastLevel * (saturatedGreen - 128) + 128);
    b = contrastLevel * (saturatedBlue - 128) + 128;

    return [r + brightnessAdjustment, g + brightnessAdjustment, b + brightnessAdjustment];
  };
}

export function warmContrastFilter(intensityFactor: number, d?: Uint8ClampedArray, r?: Uint8ClampedArray) {
  const contrastLevel = 1 + (0.3 / 100) * intensityFactor;
  const warmthAdjust = intensityFactor / 10;

  const result = r && d ? r : d ? d : undefined;

  if (d && result)
    for (let i = 0; i < d.length; i += 4) {
      result[i] = clamp(contrastLevel * (d[i] - 128) + 128 + warmthAdjust);
      result[i + 1] = clamp(contrastLevel * (d[i + 1] - 128) + 128 + warmthAdjust / 2);
      result[i + 2] = clamp(contrastLevel * (d[i + 2] - 128) + 128 - warmthAdjust / 2);
    }

  return (r: number, g: number, b: number) => [
    clamp(contrastLevel * (r - 128) + 128 + warmthAdjust),
    clamp(contrastLevel * (g - 128) + 128 + warmthAdjust / 2),
    clamp(contrastLevel * (b - 128) + 128 - warmthAdjust / 2),
  ];
}

export function calmFilter(intensityFactor: number, d?: Uint8ClampedArray, r?: Uint8ClampedArray) {
  const brightnessAdjustment = intensityFactor / 4;

  const result = r && d ? r : d ? d : undefined;

  if (d && result)
    for (let i = 0; i < d.length; i += 4) {
      const luminance = getLuminance(d[i], d[i + 1], d[i + 2]);
      const highlightBoost = 1 + ((0.2 * (luminance / 255)) / 100) * intensityFactor;
      const shadowBoost = 1 + ((-0.4 * ((255 - luminance) / 255)) / 100) * intensityFactor;

      result[i] = d[i] * shadowBoost * highlightBoost + brightnessAdjustment;
      result[i + 1] = d[i + 1] * shadowBoost * highlightBoost + brightnessAdjustment;
      result[i + 2] = d[i + 2] * shadowBoost * highlightBoost + brightnessAdjustment;
    }

  return (r: number, g: number, b: number) => {
    const luminance = getLuminance(r, g, b);
    const highlightBoost = 1 + ((0.2 * (luminance / 255)) / 100) * intensityFactor;
    const shadowBoost = 1 + ((-0.4 * ((255 - luminance) / 255)) / 100) * intensityFactor;

    r = r * shadowBoost * highlightBoost + brightnessAdjustment;
    g = g * shadowBoost * highlightBoost + brightnessAdjustment;
    b = b * shadowBoost * highlightBoost + brightnessAdjustment;

    return [r, g, b];
  };
}

export function coolLightFilter(intensityFactor: number, d?: Uint8ClampedArray, r?: Uint8ClampedArray) {
  const brightnessAdjustment = (10 / 100) * intensityFactor;
  const redAdjust = (-5 / 100) * intensityFactor;
  const greenAdjust = (2 / 100) * intensityFactor;
  const blueAdjust = (15 / 100) * intensityFactor;

  const result = r && d ? r : d ? d : undefined;

  if (d && result)
    for (let i = 0; i < d.length; i += 4) {
      const luminance = getLuminance(d[i], d[i + 1], d[i + 2]);
      const shadowBoost = 1 + ((-0.3 * ((255 - luminance) / 255)) / 100) * intensityFactor;
      const highlightBoost = 1 + ((0.2 * (luminance / 255)) / 100) * intensityFactor;
      const factor = shadowBoost * highlightBoost;

      result[i] = clamp(d[i] + redAdjust + brightnessAdjustment) * factor;
      result[i + 1] = clamp(d[i + 1] + greenAdjust + brightnessAdjustment) * factor;
      result[i + 2] = clamp(d[i + 2] + blueAdjust + brightnessAdjustment) * factor;
    }

  return (r: number, g: number, b: number) => {
    const luminance = getLuminance(r, g, b);
    const shadowBoost = 1 + ((-0.3 * ((255 - luminance) / 255)) / 100) * intensityFactor;
    const highlightBoost = 1 + ((0.2 * (luminance / 255)) / 100) * intensityFactor;
    const factor = shadowBoost * highlightBoost;

    return [
      clamp(r + redAdjust + brightnessAdjustment) * factor,
      clamp(g + greenAdjust + brightnessAdjustment) * factor,
      clamp(b + blueAdjust + brightnessAdjustment) * factor,
    ];
  };
}

export function vividCoolFilter(intensityFactor: number, d?: Uint8ClampedArray, r?: Uint8ClampedArray) {
  const contrastLevel = 1 + (0.3 / 100) * intensityFactor;
  const blueAdjust = (35 / 100) * intensityFactor;
  const greenAdjust = (15 / 100) * intensityFactor;
  const redAdjust = (-10 / 100) * intensityFactor;
  const result = r && d ? r : d ? d : undefined;

  if (d && result)
    for (let i = 0; i < d.length; i += 4) {
      result[i] = clamp(contrastLevel * (d[i] - 128) + 128 + redAdjust);
      result[i + 1] = clamp(contrastLevel * (d[i + 1] - 128) + 128 + greenAdjust);
      result[i + 2] = clamp(contrastLevel * (d[i + 2] - 128) + 128 + blueAdjust);
    }

  return (r: number, g: number, b: number) => [
    clamp(contrastLevel * (r - 128) + 128 + redAdjust),
    clamp(contrastLevel * (g - 128) + 128 + greenAdjust),
    clamp(contrastLevel * (b - 128) + 128 + blueAdjust),
  ];
}

export function dramaticCoolFilter(intensityFactor: number, d?: Uint8ClampedArray, r?: Uint8ClampedArray) {
  const contrastLevel = 1 + (0.2 / 100) * intensityFactor;
  const blueAdjust = (35 / 100) * intensityFactor;
  const greenAdjust = (5 / 100) * intensityFactor;
  const redAdjust = (-25 / 100) * intensityFactor;
  const result = r && d ? r : d ? d : undefined;

  if (d && result)
    for (let i = 0; i < d.length; i += 4) {
      result[i] = clamp(contrastLevel * (d[i] - 128) + 128 + redAdjust);
      result[i + 1] = clamp(contrastLevel * (d[i + 1] - 128) + 128 + greenAdjust);
      result[i + 2] = clamp(contrastLevel * (d[i + 2] - 128) + 128 + blueAdjust);
    }

  return (r: number, g: number, b: number) => [
    clamp(contrastLevel * (r - 128) + 128 + redAdjust),
    clamp(contrastLevel * (g - 128) + 128 + greenAdjust),
    clamp(contrastLevel * (b - 128) + 128 + blueAdjust),
  ];
}

export function blackAndWhiteFilter(intensityFactor: number, d?: Uint8ClampedArray, r?: Uint8ClampedArray) {
  const result = r && d ? r : d ? d : undefined;

  if (d && result)
    for (let i = 0; i < d.length; i += 4) {
      const luminance = getLuminance(d[i], d[i + 1], d[i + 2]);
      result[i] = d[i] + ((luminance - d[i]) / 100) * intensityFactor;
      result[i + 1] = d[i + 1] + ((luminance - d[i + 1]) / 100) * intensityFactor;
      result[i + 2] = d[i + 2] + ((luminance - d[i + 2]) / 100) * intensityFactor;
    }

  return (r: number, g: number, b: number) => {
    const luminance = getLuminance(r, g, b);
    return [
      r + ((luminance - r) / 100) * intensityFactor,
      g + ((luminance - g) / 100) * intensityFactor,
      b + ((luminance - b) / 100) * intensityFactor,
    ];
  };
}

export function blackAndWhiteWarmFilter(iF: number, d?: Uint8ClampedArray, r?: Uint8ClampedArray) {
  const wR = 255;
  const wG = 240;
  const wB = 192;
  const wF = (0.1 / 100) * iF; // Adjust the warmth intensity

  const result = r && d ? r : d ? d : undefined;

  if (d && result)
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const l = 0.299 * r + 0.587 * g + 0.114 * b;
      result[i] = d[i] + ((l + (wR - l) * wF - d[i]) / 100) * iF;
      result[i + 1] = d[i + 1] + ((l + (wG - l) * wF - d[i + 1]) / 100) * iF;
      result[i + 2] = d[i + 2] + ((l + (wB - l) * wF - d[i + 2]) / 100) * iF;
    }

  return (r: number, g: number, b: number) => {
    const l = 0.299 * g + 0.587 * b + 0.114 * b;
    return [r + ((l + (wR - l) * wF - r) / 100) * iF, g + ((l + (wG - l) * wF - g) / 100) * iF, b + ((l + (wB - l) * wF - b) / 100) * iF];
  };
}

export function blackAndWhiteCoolFilter(iF: number, d?: Uint8ClampedArray, r?: Uint8ClampedArray) {
  const cR = 173;
  const cG = 216;
  const cB = 230;
  const cF = (0.2 / 100) * iF; // Adjust the warmth intensity

  const result = r && d ? r : d ? d : undefined;

  if (d && result)
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const l = 0.299 * r + 0.587 * g + 0.114 * b;
      result[i] = d[i] + ((l + (cR - l) * cF - d[i]) / 100) * iF;
      result[i + 1] = d[i + 1] + ((l + (cG - l) * cF - d[i + 1]) / 100) * iF;
      result[i + 2] = d[i + 2] + ((l + (cB - l) * cF - d[i + 2]) / 100) * iF;
    }

  return (r: number, g: number, b: number) => {
    const l = 0.299 * r + 0.587 * g + 0.114 * b;
    return [r + ((l + (cR - l) * cF - r) / 100) * iF, g + ((l + (cG - l) * cF - g) / 100) * iF, b + ((l + (cB - l) * cF - b) / 100) * iF];
  };
}

export function blackAndWhiteHighContrastFilter(iF: number, d?: Uint8ClampedArray, r?: Uint8ClampedArray) {
  const contrastLevel = 1 + (0.4 / 100) * iF;

  const result = r && d ? r : d ? d : undefined;

  if (d && result)
    for (let i = 0; i < d.length; i += 4) {
      const r = clamp(contrastLevel * (d[i] - 128) + 128);
      const g = clamp(contrastLevel * (d[i + 1] - 128) + 128);
      const b = clamp(contrastLevel * (d[i + 2] - 128) + 128);

      const luminance = getLuminance(r, g, b);
      result[i] = r + ((luminance - r) / 100) * iF;
      result[i + 1] = g + ((luminance - g) / 100) * iF;
      result[i + 2] = b + ((luminance - b) / 100) * iF;
    }

  return (r: number, g: number, b: number) => {
    r = clamp(contrastLevel * (r - 128) + 128);
    g = clamp(contrastLevel * (g - 128) + 128);
    b = clamp(contrastLevel * (b - 128) + 128);

    const luminance = getLuminance(r, g, b);
    return [r + ((luminance - r) / 100) * iF, g + ((luminance - g) / 100) * iF, b + ((luminance - b) / 100) * iF];
  };
}

export function burnFilter(iF: number, d?: Uint8ClampedArray, r?: Uint8ClampedArray) {
  const brightnessAdjustment = (20 / 100) * iF;
  const contrastLevel = 1 + (0.5 / 100) * iF;
  const greenAdjust = (3 / 100) * iF;
  const sv = (0.8 / 100) * iF + 1;

  const result = r && d ? r : d ? d : undefined;

  if (d && result)
    for (let i = 0; i < d.length; i += 4) {
      let r = d[i];
      let g = d[i + 1];
      let b = d[i + 2];

      const az = (1 - sv) * luR + sv;
      const bz = (1 - sv) * luG;
      const cz = (1 - sv) * luB;
      const dz = (1 - sv) * luR;
      const ez = (1 - sv) * luG + sv;
      const fz = (1 - sv) * luB;
      const gz = (1 - sv) * luR;
      const hz = (1 - sv) * luG;
      const iz = (1 - sv) * luB + sv;

      const luminance = getLuminance(r, g, b);
      const shadowBoost = 1 + ((-0.6 * ((255 - luminance) / 255)) / 100) * iF;

      r = clamp(contrastLevel * (r - 128) + 128 + brightnessAdjustment) * shadowBoost;
      g = clamp(contrastLevel * (g - 128) + 128 + brightnessAdjustment + greenAdjust) * shadowBoost;
      b = clamp(contrastLevel * (b - 128) + 128 + brightnessAdjustment) * shadowBoost;

      result[i] = clamp(az * r + bz * g + cz * b);
      result[i + 1] = clamp(dz * r + ez * g + fz * b);
      result[i + 2] = clamp(gz * r + hz * g + iz * b);
    }

  return (r: number, g: number, b: number) => {
    const az = (1 - sv) * luR + sv;
    const bz = (1 - sv) * luG;
    const cz = (1 - sv) * luB;
    const dz = (1 - sv) * luR;
    const ez = (1 - sv) * luG + sv;
    const fz = (1 - sv) * luB;
    const gz = (1 - sv) * luR;
    const hz = (1 - sv) * luG;
    const iz = (1 - sv) * luB + sv;

    const luminance = getLuminance(r, g, b);
    const shadowBoost = 1 + ((-0.6 * ((255 - luminance) / 255)) / 100) * iF;

    r = clamp(contrastLevel * (r - 128) + 128 + brightnessAdjustment) * shadowBoost;
    g = clamp(contrastLevel * (g - 128) + 128 + brightnessAdjustment + greenAdjust) * shadowBoost;
    b = clamp(contrastLevel * (b - 128) + 128 + brightnessAdjustment) * shadowBoost;

    return [clamp(az * r + bz * g + cz * b), clamp(dz * r + ez * g + fz * b), clamp(gz * r + hz * g + iz * b)];
  };
}

export function filmFilter(iF: number, d?: Uint8ClampedArray, r?: Uint8ClampedArray) {
  const redAdjust = (-10 / 100) * iF;
  const greenAdjust = (10 / 100) * iF;
  const blueAdjust = (5 / 100) * iF;

  const result = r && d ? r : d ? d : undefined;

  if (d && result)
    for (let i = 0; i < d.length; i += 4) {
      const red = d[i];
      const green = d[i + 1];
      const blue = d[i + 2];

      // Apply a green tint
      result[i] = red + redAdjust; // Reduce red slightly
      result[i + 1] = green + greenAdjust; // Increase green slightly
      result[i + 2] = blue + blueAdjust; // Reduce blue slightly
    }

  return (r: number, g: number, b: number) => [r + redAdjust, g + greenAdjust, b + blueAdjust];
}

export function vintageFilter(iF: number, d?: Uint8ClampedArray, r?: Uint8ClampedArray) {
  const intensity = iF / 2;
  const contrastLevel = 1 - (0.1 / 100) * intensity;
  const washoutLevel = intensity / 10;

  const result = r && d ? r : d ? d : undefined;

  if (d && result)
    for (let i = 0; i < d.length; i += 4) {
      const red = d[i];
      const green = d[i + 1];
      const blue = d[i + 2];

      // Apply a sepia tone
      const tr = 0.393 * red + 0.769 * green + 0.189 * blue;
      const tg = 0.349 * red + 0.686 * green + 0.168 * blue;
      const tb = 0.272 * red + 0.534 * green + 0.131 * blue;

      const nr = d[i] + ((tr - d[i]) / 100) * intensity;
      const ng = d[i + 1] + ((tg - d[i + 1]) / 100) * intensity;
      const nb = d[i + 2] + ((tb - d[i + 2]) / 100) * intensity;

      result[i] = nr > 255 ? 255 : nr;
      result[i + 1] = ng > 255 ? 255 : ng;
      result[i + 2] = nb > 255 ? 255 : nb;

      // Reduce contrast and add a slight washout effect
      result[i] = result[i] * contrastLevel + washoutLevel;
      result[i + 1] = result[i + 1] * contrastLevel + washoutLevel;
      result[i + 2] = result[i + 2] * contrastLevel + washoutLevel;
    }

  return (r: number, g: number, b: number) => {
    // Apply a sepia tone
    const tr = 0.393 * r + 0.769 * g + 0.189 * b;
    const tg = 0.349 * r + 0.686 * g + 0.168 * b;
    const tb = 0.272 * r + 0.534 * g + 0.131 * b;

    const nr = r + ((tr - r) / 100) * intensity;
    const ng = g + ((tg - g) / 100) * intensity;
    const nb = b + ((tb - b) / 100) * intensity;

    r = nr > 255 ? 255 : nr;
    g = ng > 255 ? 255 : ng;
    b = nb > 255 ? 255 : nb;

    return [r * contrastLevel + washoutLevel, g * contrastLevel + washoutLevel, b * contrastLevel + washoutLevel];
  };
}

function getLuminance(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}
