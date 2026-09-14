#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Merges part1, part2, part3 and outputs /src/data/toeic1000Vocab.ts
"""
import json
import sys
import os

# Import parts
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))
from vocab_data_part1 import DAYS_1_TO_10
from vocab_data_part2 import DAYS_11_TO_20
from vocab_data_part3 import DAYS_21_TO_30

all_days = {}
all_days.update(DAYS_1_TO_10)
all_days.update(DAYS_11_TO_20)
all_days.update(DAYS_21_TO_30)

vocab_list = []
word_counter = 1

# If any day has less or we need to guarantee exact or >= 1000 items:
for day_num in range(1, 31):
    if day_num not in all_days:
        print(f"Missing day {day_num}!")
        continue
    category, level, words = all_days[day_num]
    for w_entry in words:
        word, meaning, pos, colloc, para, ex_en, ex_ko = w_entry
        item_id = f"v_1000_{word_counter}"
        vocab_list.append({
            "id": item_id,
            "word": word,
            "meaning": meaning,
            "partOfSpeech": pos,
            "collocation": colloc,
            "paraphraseWith": para,
            "exampleEn": ex_en,
            "exampleKo": ex_ko,
            "category": category,
            "day": day_num,
            "level": level
        })
        word_counter += 1

print(f"Total vocabulary items generated: {len(vocab_list)}")

# Write to ./src/data/toeic1000Vocab.ts
output_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "toeic1000Vocab.ts")
ts_content = """// TOEIC 1000 High-Frequency Vocabulary Database (Day 1 - Day 30)
// Complete 30-day curriculum specifically crafted for jumping from 620 to 800+
import { VocabItem } from '../types';

export const TOEIC_1000_VOCAB: VocabItem[] = """ + json.dumps(vocab_list, ensure_ascii=False, indent=2) + ";\n"

with open(output_path, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully wrote {len(vocab_list)} items to {output_path}")
