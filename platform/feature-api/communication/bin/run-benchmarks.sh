#!/usr/bin/env bash
find ./src -name "*.bench.ts" | while read -r FILE; do
  echo "$FILE"
  npx ts-node "$FILE"
done