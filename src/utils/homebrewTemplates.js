// src/utils/homebrewTemplates.js

/**
 * Homebrew kategori şablonları
 * Backend enum'ları artık Wiki ile aynı:
 * BACKGROUND, SPELLS, MAGIC_ITEM, FEATS, MONSTERS, PLANES, WEAPON, RACES, CONDITIONS, ARMOR, CLASSES, CUSTOM
 */

export const HOMEBREW_TEMPLATES = {
  SPELLS: {  // ✅ SPELL → SPELLS
    level: 0,
    school: "",
    casting_time: "1 eylem",
    range: "Dokunma",
    components: "S, B, M",
    duration: "Anlık",
    desc: "",
    higher_level: "",
    available_for: ""
  },

  MONSTERS: {  // ✅ MONSTER → MONSTERS
    size: "Orta",
    type: "insansı",
    alignment: "tarafsız",
    armor_class: 10,
    hit_points: "10 (2d8 + 2)",
    speed: "30 ft.",
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    senses: "pasif Algı 10",
    languages: "Ortak Dil",
    challenge_rating: "1/8",
    special_abilities: [],
    actions: [],
    reactions: [],
    legendary_actions: [],
    desc: ""
  },

  RACES: {  // ✅ RACE → RACES
    type: "",
    alignment: "",
    age: "",
    size: "Orta",
    speed: "30 ft.",
    ability_score_increase: "",
    languages: "",
    traits: [],
    subraces: [],
    desc: ""
  },

  CLASSES: {  // ✅ CLASS → CLASSES
    hit_die: "d8",
    primary_ability: "",
    saving_throws: "",
    armor_proficiency: "",
    weapon_proficiency: "",
    tool_proficiency: "",
    skill_proficiency: "",
    starting_equipment: "",
    multiclassing: {
      prerequisites: "",
      proficiencies: ""
    },
    class_features: [],
    subclasses: [],
    desc: ""
  },

  BACKGROUND: {  // ✅ Aynı kaldı
    skill_proficiencies: "",
    tool_proficiencies: "",
    languages: "",
    equipment: "",
    feature: {
      name: "",
      description: ""
    },
    suggested_characteristics: "",
    desc: ""
  },

  FEATS: {  // ✅ FEAT → FEATS
    prerequisite: "",
    benefits: [],
    desc: ""
  },

  MAGIC_ITEM: {  // ✅ Aynı kaldı
    type: "Harika Eşya",
    rarity: "Sıradan",
    attunement: false,
    attunement_requirements: "",
    properties: [],
    desc: ""
  },

  WEAPON: {  // ✅ Aynı kaldı
    category: "Basit Yakın Dövüş",
    damage: {
      dice: "1d6",
      type: "darbe"
    },
    weight: "1 lb.",
    properties: [],
    cost: "1 gp",
    range: "",
    desc: ""
  },

  ARMOR: {  // ✅ Aynı kaldı
    type: "Hafif Zırh",
    armor_class: "11",
    strength_requirement: "",
    stealth_disadvantage: false,
    weight: "10 lb.",
    cost: "5 gp",
    desc: ""
  },

  CONDITIONS: {  // ✅ CONDITION → CONDITIONS
    effects: [],
    desc: ""
  },

  PLANES: {  // ✅ PLANE → PLANES
    type: "",
    alignment: "",
    inhabitants: "",
    features: [],
    desc: ""
  },

  CUSTOM: {  // ✅ Aynı kaldı
    desc: ""
  }
};

/**
 * Template getter (case-insensitive fallback)
 */
export const getTemplate = (category) => {
  if (!category) return HOMEBREW_TEMPLATES.CUSTOM;
  
  // Exact match
  if (HOMEBREW_TEMPLATES[category]) {
    return { ...HOMEBREW_TEMPLATES[category] };
  }
  
  // Fallback
  return { ...HOMEBREW_TEMPLATES.CUSTOM };
};

/**
 * Kategori default image mapping
 */
export const HOMEBREW_DEFAULT_IMAGES = {
  SPELLS: '/wiki/spells.png',        // ✅ Updated
  MONSTERS: '/wiki/monsters.png',    // ✅ Updated
  RACES: '/wiki/races.png',          // ✅ Updated
  CLASSES: '/wiki/classes.png',      // ✅ Updated
  BACKGROUND: '/wiki/background.png',
  FEATS: '/wiki/feats.png',          // ✅ Updated
  MAGIC_ITEM: '/wiki/magic_items.png',
  WEAPON: '/wiki/weapons.png',
  ARMOR: '/wiki/armors.png',
  CONDITIONS: '/wiki/conditions.png', // ✅ Updated
  PLANES: '/wiki/planes.png',         // ✅ Updated
  CUSTOM: '/wiki/spells.png'
};

/**
 * Homebrew entry için resim URL'i döndür
 */
export const getHomebrewImageUrl = (entry) => {
  if (entry?.imageUrl) return entry.imageUrl;
  return HOMEBREW_DEFAULT_IMAGES[entry?.category] || HOMEBREW_DEFAULT_IMAGES.CUSTOM;
};

/**
 * Kategori etiketleri (Wiki ile uyumlu)
 */
export const CATEGORY_LABELS = {
  SPELLS: "Büyüler",          // ✅ Updated
  MONSTERS: "Canavarlar",     // ✅ Updated
  RACES: "Irklar",            // ✅ Updated
  CLASSES: "Sınıflar",        // ✅ Updated
  BACKGROUND: "Geçmişler",
  FEATS: "Yetenekler",        // ✅ Updated
  MAGIC_ITEM: "Sihirli Eşyalar",
  WEAPON: "Silahlar",
  ARMOR: "Zırhlar",
  CONDITIONS: "Durumlar",     // ✅ Updated
  PLANES: "Düzlemler",        // ✅ Updated
  CUSTOM: "Özel"
};

/**
 * Kategori açıklamaları
 */
export const CATEGORY_DESCRIPTIONS = {
  SPELLS: "Büyüler, karakterlerin kullanabileceği sihirli güçlerdir. Seviye, okul, bileşenler gibi bilgileri içerir.",
  MONSTERS: "Düşman veya NPC yaratıklar. İstatistikler, yetenekler ve eylemler içerir.",
  RACES: "Oynanabilir ırklar. Yetenek bonusları, özellikler ve alt ırklar.",
  CLASSES: "Karakter sınıfları. Can zarı, yeterlilikler ve sınıf özellikleri.",
  BACKGROUND: "Karakter geçmişleri. Beceriler, ekipman ve özel özellikler.",
  FEATS: "Özel yetenekler. Ön koşullar ve faydalar.",
  MAGIC_ITEM: "Sihirli eşyalar. Nadirlik, uyum ve özellikler.",
  WEAPON: "Silahlar. Hasar, özellikler ve menzil bilgileri.",
  ARMOR: "Zırhlar. ZS, ağırlık ve dezavantaj bilgileri.",
  CONDITIONS: "Durum etkileri. Karakterleri etkileyen durumlar.",
  PLANES: "Varlık düzlemleri. Özellikler ve sakinler.",
  CUSTOM: "Özel içerik. Kendi kategorinizi oluşturun."
};