type NestedObject = { [key: string]: any };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function convertKeysToCamelCase(obj: NestedObject): NestedObject {
  if (Array.isArray(obj)) {
    // If it's an array, recursively apply the function to each element
    return obj.map((item) => convertKeysToCamelCase(item));
  } else if (typeof obj === 'object' && obj !== null) {
    // If it's an object, process its keys
    const newObject: NestedObject = {};

    for (const key in obj) {
      // Convert the key from snake_case to camelCase
      const camelCaseKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());

      // Recursively apply the transformation for nested objects and arrays
      newObject[camelCaseKey] = convertKeysToCamelCase(obj[key]);
    }

    return newObject;
  }

  // If it's neither an array nor an object, return the value as is
  return obj;
}
