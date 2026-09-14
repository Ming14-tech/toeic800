#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Full Generator for TOEIC 1000 Top-Frequency Words
"""
import json
import os

# Helper to build word item
def make_word(word, meaning, pos, collocation, paraphrase, ex_en, ex_ko, category, day, level="800필수"):
    return {
        "word": word.strip(),
        "meaning": meaning.strip(),
        "partOfSpeech": pos.strip(),
        "collocation": collocation.strip(),
        "paraphraseWith": paraphrase.strip() if paraphrase else "",
        "exampleEn": ex_en.strip(),
        "exampleKo": ex_ko.strip(),
        "category": category.strip(),
        "day": day,
        "level": level
    }

print("Generator module started")
