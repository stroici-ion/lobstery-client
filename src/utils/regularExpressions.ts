export const stripEmojis = (str: string) =>
  str
    .replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
