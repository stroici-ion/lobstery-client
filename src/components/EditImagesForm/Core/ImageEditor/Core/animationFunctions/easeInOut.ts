export const easeInOut = (time: number) => {
  return 0.5 * (1 - Math.cos(Math.PI * time));
};
