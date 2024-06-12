quicktype -o src/receipt.rs --src-lang schema data/receipt.schema.json \
          --density dense \
          --visibility public \
          --derive-debug
cargo fmt --
git add src/receipt.rs