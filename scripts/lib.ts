export const isObjectSubset = (
  subObject: object,
  superObject: object,
  strict = false,
): boolean => {
  for (const key of Object.keys(subObject)) {
    if (!Object.hasOwn(superObject, key)) {
      console.log("missing", key);
      return false;
    }
    const subValue = (subObject as any)[key];
    const superValue = (superObject as any)[key];
    if (typeof subValue === "object" && typeof superValue === "object") {
      if (!isObjectSubset(subValue, superValue, strict)) {
        return false;
      }
    }
  }
  return true;
};
