quicktype -o src/receipt.rs --src-lang schema data_objects/receipt.schema.json
cargo fmt --
git add src/receipt.rs