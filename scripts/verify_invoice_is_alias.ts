// @ts-ignore
import invoiceSchema from "../events/invoice.schema.json";
// @ts-ignore
import receiptSchema from "../events/receipt.schema.json";

const ALLOWED_DIFFERING_KEYS = new Set(["$id", "title", "description"]);

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (typeof a !== "object") return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((k) => deepEqual(a[k], b[k]));
}

function check() {
  if ((invoiceSchema as any).title !== "Invoice") {
    throw new Error(
      `Expected invoice title "Invoice", got "${(invoiceSchema as any).title}"`,
    );
  }
  if ((receiptSchema as any).title !== "Receipt") {
    throw new Error(
      `Expected receipt title "Receipt", got "${(receiptSchema as any).title}"`,
    );
  }

  const keys = Array.from(
    new Set(Object.keys(invoiceSchema).concat(Object.keys(receiptSchema))),
  );

  const mismatches: string[] = [];
  for (const key of keys) {
    if (ALLOWED_DIFFERING_KEYS.has(key)) continue;
    if (!deepEqual((invoiceSchema as any)[key], (receiptSchema as any)[key])) {
      mismatches.push(key);
    }
  }

  if (mismatches.length > 0) {
    throw new Error(
      `Invoice schema differs from receipt schema at non-identity keys: ${mismatches.join(", ")}`,
    );
  }

  console.log("OK");
}

check();
