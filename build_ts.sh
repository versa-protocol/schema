pnpm exec json2ts data/receipt.schema.json > web/schema.ts --ignoreMinAndMaxItems --additionalProperties false
git add web/schema.ts
