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
    // The following two clauses don't really belong here;
    // generally this verification process should be improved to ensure
    // all formatting patterns, mins, and maxes are uniform between schemas
    if (key === "pattern") {
      if (!!superValue && !subValue) {
        console.log("pattern must always be defined for", parentKey);
      }
      if (!!subValue && subValue !== superValue) {
        console.log("pattern mismatch for", parentKey, superValue, subValue);
        return false;
      }
    }
    if (key === "type") {
      if (!!superValue && !subValue) {
        console.log("type must always be defined for", parentKey);
      }
      if (subValue.toString() !== superValue.toString()) {
        console.log("type mismatch for", parentKey, superValue, subValue);
        return false;
      }
    }
  }
  return true;
};
