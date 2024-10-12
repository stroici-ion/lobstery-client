export function compareObjects(obj1: any, obj2: any): boolean {
  if (!obj1 || !obj2) return false;
  for (const key in obj1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
}
