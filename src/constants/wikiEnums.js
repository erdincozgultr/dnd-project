// src/constants/wikiEnums.js

export const CATEGORY_MAPPING = {
  // UI ID -> Backend Enum
  spells: 'SPELL',
  monsters: 'MONSTER',
  items: 'ITEM',
  classes: 'CLASS',
  general: 'GENERAL', // Sadece Homebrew
  races: 'RACE' // Wiki'de varsa
};

export const REVERSE_CATEGORY_LABELS = {
  SPELL: 'Büyü',
  MONSTER: 'Canavar',
  ITEM: 'Eşya',
  CLASS: 'Sınıf',
  GENERAL: 'Genel',
  RACE: 'Irk'
};

export const LIKE_TARGET_TYPES = {
  WIKI: 'WIKI_ENTRY',
  HOMEBREW: 'HOMEBREW_ENTRY'
};