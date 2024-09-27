export const cleanUpString = (input: string): string => {
  let result = input.replace(/\n/g, ' ');

  result = result.replace(/\s+/g, ' ');

  if (result.startsWith(' ')) {
    result = result.trimStart();
  }

  return result;
};
