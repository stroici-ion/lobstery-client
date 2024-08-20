export const getLikes = (count: number) => {
  if (count > 999999999) return (count / 1000000000).toFixed(1) + " B";
  if (count > 999999) return (count / 1000000).toFixed(1) + " M";
  if (count > 999) return (count / 1000).toFixed(1) + " K";
  return count;
};
