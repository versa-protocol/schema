export const isObjectSubset = (
  subObject: object,
  superObject: object,
  parentKey: string = "root",
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
      if (!isObjectSubset(subValue, superValue, key, strict)) {
        return false;
      }
    }
    if (key === "pattern") {
      if (!!subValue && subValue !== superValue) {
        console.log("pattern mismatch for", parentKey, superValue, subValue);
        return false;
      }
    }
    if (key === "type") {
      if (subValue.toString() !== superValue.toString()) {
        console.log("type mismatch for", parentKey, superValue, subValue);
        return false;
      }
    }
  }

  // Check for keys in superObject that must also exist in subObject
  const mustMatchKeys = ["pattern", "type"];
  for (const key of mustMatchKeys) {
    if (Object.hasOwn(superObject, key) && !Object.hasOwn(subObject, key)) {
      console.log(`${key} missing in sub-schema for`, parentKey);
      return false;
    }
  }

  return true;
};
