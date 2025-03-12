type NestedObject = { [key: string]: any };

export default function convertKeysToCamelCase(obj: NestedObject): NestedObject {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item));
  } else if (typeof obj === 'object' && obj !== null) {
    const newObject: NestedObject = {};

    for (const key in obj) {
      const camelCaseKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());

      newObject[camelCaseKey] = convertKeysToCamelCase(obj[key]);
    }

    return newObject;
  }

  return obj;
}
