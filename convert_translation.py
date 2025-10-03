#!/usr/bin/env python3
import json

input_file = "src/data/translations/en/SaheehInternational.txt"
output_file = "src/data/translations/en/SaheehInternational.json"

# Read and parse the file
data = {}
with open(input_file, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue

        parts = line.split('|', 2)
        if len(parts) != 3:
            continue

        surah = parts[0]
        ayah = parts[1]
        text = parts[2]

        if surah not in data:
            data[surah] = {}

        data[surah][ayah] = text

# Write to JSON
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Converted {len(data)} surahs to {output_file}")
