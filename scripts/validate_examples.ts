import * as fs from "fs";
import * as path from "path";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

const examplesBaseDir = path.join(__dirname, "..", "examples");
const schemasDir = path.join(__dirname, "..", "data");

// Load and compile schemas
const itinerarySchema = JSON.parse(
  fs.readFileSync(path.join(schemasDir, "itinerary.schema.json"), "utf-8"),
);
const receiptSchema = JSON.parse(
  fs.readFileSync(path.join(schemasDir, "receipt.schema.json"), "utf-8"),
);

const validateItinerary = ajv.compile(itinerarySchema);
const validateReceipt = ajv.compile(receiptSchema);

function formatValidationErrors(errors: any[], fileName: string): string[] {
  return errors.map((err) => {
    const path = err.instancePath || "/";
    const message = err.message || "Unknown error";
    return `${fileName}: ${path} ${message}`;
  });
}

function validateFile(
  filePath: string,
  validator: any,
): { valid: boolean; errors: string[] } {
  const fileName = path.basename(filePath);

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);

    const valid = validator(data);

    if (valid) {
      return { valid: true, errors: [] };
    } else {
      return {
        valid: false,
        errors: formatValidationErrors(validator.errors || [], fileName),
      };
    }
  } catch (error) {
    return {
      valid: false,
      errors: [`${fileName}: Failed to parse JSON - ${error}`],
    };
  }
}

function validateExamples(type: "itinerary" | "receipt", validator: any) {
  console.log(`Validating ${type} examples...\n`);

  const examplesDir = path.join(examplesBaseDir, type);

  if (!fs.existsSync(examplesDir)) {
    console.log(`No ${type} examples directory found at ${examplesDir}\n`);
    return true;
  }

  const files = fs
    .readdirSync(examplesDir)
    .filter((f: string) => f.endsWith(".json"));

  if (files.length === 0) {
    console.log(`No ${type} examples found\n`);
    return true;
  }

  let allValid = true;

  for (const file of files) {
    const filePath = path.join(examplesDir, file);
    const result = validateFile(filePath, validator);

    if (result.valid) {
      console.log(`✓ ${file}`);
    } else {
      console.log(`✗ ${file}`);
      result.errors.forEach((error) => console.log(`  - ${error}`));
      allValid = false;
    }
  }

  console.log("");
  return allValid;
}

function validateAll() {
  let allValid = true;

  // Validate itineraries
  allValid = validateExamples("itinerary", validateItinerary) && allValid;

  // Validate receipts
  allValid = validateExamples("receipt", validateReceipt) && allValid;

  if (allValid) {
    console.log("All examples are valid!");
  } else {
    console.log("Some examples have validation errors.");
    process.exit(1);
  }
}

validateAll();
