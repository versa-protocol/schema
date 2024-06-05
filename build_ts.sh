quicktype -o web/schema.ts --src-lang schema data_objects/*

# json2ts -i data_objects/ -o web/schema.ts

git add web/schema.ts
