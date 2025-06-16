import * as fs from "fs";
import * as path from "path";

const schemasDir = path.join(__dirname, "..", "data");

interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
}

function validateSchemaStructure(
  filePath: string,
  schemaType: "receipt" | "itinerary",
): SchemaValidationResult {
  const fileName = path.basename(filePath);
  const errors: string[] = [];

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const schema = JSON.parse(content);

    // Check top-level properties exist
    if (!schema.properties) {
      errors.push(`${fileName}: Missing 'properties' at schema root`);
      return { valid: false, errors };
    }

    const requiredTopLevelProps = [
      "schema_version",
      "header",
      "itemization",
      "footer",
    ];

    for (const prop of requiredTopLevelProps) {
      if (!schema.properties[prop]) {
        errors.push(
          `${fileName}: Missing required top-level property '${prop}'`,
        );
      }
    }

    // Check that required properties are actually marked as required
    const requiredArray = schema.required || [];
    const expectedRequired = [
      "schema_version",
      "header",
      "itemization",
      "footer",
    ];

    for (const prop of expectedRequired) {
      if (!requiredArray.includes(prop)) {
        errors.push(
          `${fileName}: Property '${prop}' should be in required array`,
        );
      }
    }

    // Check schema_version has proper pattern
    const schemaVersionProp = schema.properties.schema_version;
    if (schemaVersionProp) {
      if (!schemaVersionProp.pattern) {
        errors.push(
          `${fileName}: schema_version property missing pattern validation`,
        );
      } else {
        // Check if pattern looks like semantic version pattern
        const pattern = schemaVersionProp.pattern;
        if (!pattern.includes("\\d") || !pattern.includes("\\.")) {
          errors.push(
            `${fileName}: schema_version pattern doesn't appear to validate semantic versioning`,
          );
        }
      }
    }

    // Check that header, itemization, and footer reference $defs
    const propsToCheck = ["header", "itemization", "footer"];
    for (const prop of propsToCheck) {
      const propDef = schema.properties[prop];
      if (propDef && !propDef.$ref) {
        errors.push(
          `${fileName}: Property '${prop}' should reference $defs (missing $ref)`,
        );
      }
    }

    // Check that $defs section exists and contains the referenced definitions
    if (!schema.$defs) {
      errors.push(`${fileName}: Missing $defs section`);
    } else {
      const expectedDefs = ["header", "itemization", "footer"];
      for (const def of expectedDefs) {
        if (!schema.$defs[def]) {
          errors.push(`${fileName}: Missing definition '${def}' in $defs`);
        }
      }
    }

    // Schema-specific validations
    if (schemaType === "receipt") {
      // Receipt should have payments in required properties
      if (!schema.properties.payments) {
        errors.push(`${fileName}: Receipt schema missing 'payments' property`);
      }
      if (!requiredArray.includes("payments")) {
        errors.push(
          `${fileName}: Receipt schema should require 'payments' property`,
        );
      }
    }

    return { valid: errors.length === 0, errors };
  } catch (error) {
    return {
      valid: false,
      errors: [`${fileName}: Failed to parse JSON schema - ${error}`],
    };
  }
}

function validateSchemas() {
  console.log("Metavalidating JSON schema files...\n");

  const schemaFiles = [
    { file: "receipt.schema.json", type: "receipt" as const },
    { file: "itinerary.schema.json", type: "itinerary" as const },
  ];

  let allValid = true;

  for (const { file, type } of schemaFiles) {
    const filePath = path.join(schemasDir, file);

    if (!fs.existsSync(filePath)) {
      console.log(`✗ ${file} - File not found`);
      allValid = false;
      continue;
    }

    const result = validateSchemaStructure(filePath, type);

    if (result.valid) {
      console.log(`✓ ${file}`);
    } else {
      console.log(`✗ ${file}`);
      result.errors.forEach((error) => console.log(`  - ${error}`));
      allValid = false;
    }
  }

  console.log("");

  if (allValid) {
    console.log("All schema files have valid structure!");
  } else {
    console.log("Some schema files have structural issues.");
    process.exit(1);
  }
}

validateSchemas();
