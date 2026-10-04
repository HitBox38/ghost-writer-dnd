"use client";

import type { CharacterProfile } from "@/lib/types";
import { type CharacterDraft } from "@/stores/character-draft-store";
import { BLANK_CHARACTER } from "@/stores/character-draft-store";
export const getDraft = (character?: CharacterProfile): CharacterDraft => {
  if (!character) return BLANK_CHARACTER;
  const {
    name,
    race,
    class: characterClass,
    level,
    backstory,
    appearance,
    worldSetting,
    characterSheet,
    characterSheetMetadata,
    portrait,
  } = character;
  return {
    name,
    race,
    class: characterClass,
    level,
    backstory,
    appearance,
    worldSetting,
    characterSheet,
    characterSheetMetadata,
    portrait,
  };
};
