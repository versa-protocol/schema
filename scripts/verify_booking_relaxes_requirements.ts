// @ts-ignore
import bookingSchema from "../events/booking.schema.json";
// @ts-ignore
import receiptSchema from "../events/receipt.schema.json";

const ALLOWED_DIFFERING_KEYS = new Set(["$id", "title", "description"]);

function isNullableTypeArray(
  bookingType: unknown,
  receiptType: unknown,
): boolean {
  return (
    typeof receiptType === "string" &&
    Array.isArray(bookingType) &&
    bookingType.length === 2 &&
    bookingType.includes(receiptType) &&
    bookingType.includes("null")
  );
}

function unwrapOneOfNull(node: any): any | null {
  if (!node || typeof node !== "object" || Array.isArray(node)) return null;
  if (!Array.isArray(node.oneOf)) return null;
  if (Object.keys(node).length !== 1) return null;
  if (node.oneOf.length !== 2) return null;
  const nullBranch = node.oneOf.find(
    (b: any) =>
      b &&
      typeof b === "object" &&
      b.type === "null" &&
      Object.keys(b).length === 1,
  );
  if (!nullBranch) return null;
  const nonNullBranch = node.oneOf.find((b: any) => b !== nullBranch);
  if (!nonNullBranch) return null;
  return nonNullBranch;
}

function isRelaxed(booking: any, receipt: any, path: string): boolean {
  if (booking === receipt) return true;

  const bookingUnwrapped = unwrapOneOfNull(booking);
  const receiptUnwrapped = unwrapOneOfNull(receipt);
  if (bookingUnwrapped !== null && receiptUnwrapped === null) {
    return isRelaxed(bookingUnwrapped, receipt, path);
  }

  if (Array.isArray(booking) && Array.isArray(receipt)) {
    if (booking.length !== receipt.length) {
      console.log(
        `array length mismatch at ${path}: booking=${booking.length} receipt=${receipt.length}`,
      );
      return false;
    }
    return booking.every((v, i) => isRelaxed(v, receipt[i], `${path}[${i}]`));
  }

  if (
    booking === null ||
    receipt === null ||
    typeof booking !== "object" ||
    typeof receipt !== "object"
  ) {
    console.log(
      `value mismatch at ${path}: booking=${JSON.stringify(booking)} receipt=${JSON.stringify(receipt)}`,
    );
    return false;
  }

  const keys = Array.from(
    new Set(Object.keys(booking).concat(Object.keys(receipt))),
  );
  for (const key of keys) {
    const b = booking[key];
    const r = receipt[key];

    if (key === "type" && isNullableTypeArray(b, r)) continue;

    if (key === "required" && Array.isArray(b) && Array.isArray(r)) {
      const extras = b.filter((k) => !r.includes(k));
      if (extras.length > 0) {
        console.log(
          `required at ${path} includes fields not required in receipt: ${JSON.stringify(extras)}`,
        );
        return false;
      }
      continue;
    }

    if (b === undefined) {
      if (key === "minItems") continue;
      console.log(`booking missing key "${key}" at ${path}`);
      return false;
    }
    if (r === undefined) {
      console.log(`booking has extra key "${key}" at ${path}`);
      return false;
    }

    if (!isRelaxed(b, r, `${path}.${key}`)) return false;
  }

  return true;
}

function check() {
  const keys = Array.from(
    new Set(Object.keys(bookingSchema).concat(Object.keys(receiptSchema))),
  );

  let ok = true;
  for (const key of keys) {
    if (ALLOWED_DIFFERING_KEYS.has(key)) continue;
    if (
      !isRelaxed((bookingSchema as any)[key], (receiptSchema as any)[key], key)
    ) {
      ok = false;
    }
  }

  if (!ok) {
    throw new Error(
      "Booking schema contains changes from receipt that are not pure nullable/optional relaxations",
    );
  }

  console.log("OK");
}

check();
