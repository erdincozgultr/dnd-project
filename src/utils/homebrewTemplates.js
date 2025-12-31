// src/utils/homebrewTemplates.js

/**
 * Homebrew kategori şablonları
 * Backend enum'ları: SPELL, MONSTER, RACE, CLASS, BACKGROUND, FEAT, MAGIC_ITEM, WEAPON, ARMOR, CONDITION, PLANE, CUSTOM
 */

export const HOMEBREW_TEMPLATES = {
  SPELL: {
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

  MONSTER: {
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

  RACE: {
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

  CLASS: {
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

  BACKGROUND: {
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

  FEAT: {
    prerequisite: "",
    benefits: [],
    desc: ""
  },

  MAGIC_ITEM: {
    type: "Harika Eşya",
    rarity: "Sıradan",
    attunement: false,
    attunement_requirements: "",
    properties: [],
    desc: ""
  },

  WEAPON: {
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

  ARMOR: {
    type: "Hafif Zırh",
    armor_class: "11",
    strength_requirement: "",
    stealth_disadvantage: false,
    weight: "10 lb.",
    cost: "5 gp",
    desc: ""
  },

  CONDITION: {
    effects: [],
    desc: ""
  },

  PLANE: {
    type: "",
    alignment: "",
    inhabitants: "",
    features: [],
    desc: ""
  },

  CUSTOM: {
    desc: ""
  }
};

export const CATEGORY_LABELS = {
  SPELL: "Büyüler",
  MONSTER: "Canavarlar",
  RACE: "Irklar",
  CLASS: "Sınıflar",
  BACKGROUND: "Geçmişler",
  FEAT: "Yetenekler",
  MAGIC_ITEM: "Sihirli Eşyalar",
  WEAPON: "Silahlar",
  ARMOR: "Zırhlar",
  CONDITION: "Durumlar",
  PLANE: "Düzlemler",
  CUSTOM: "Özel"
};

export const CATEGORY_DESCRIPTIONS = {
  SPELL: "Büyüler, karakterlerin kullanabileceği sihirli güçlerdir. Seviye, okul, bileşenler gibi bilgileri içerir.",
  MONSTER: "Düşman veya NPC yaratıklar. İstatistikler, yetenekler ve eylemler içerir.",
  RACE: "Oynanabilir ırklar. Yetenek bonusları, özellikler ve alt ırklar.",
  CLASS: "Karakter sınıfları. Can zarı, yeterlilikler ve sınıf özellikleri.",
  BACKGROUND: "Karakter geçmişleri. Beceriler, ekipman ve özel özellikler.",
  FEAT: "Özel yetenekler. Ön koşullar ve faydalar.",
  MAGIC_ITEM: "Sihirli eşyalar. Nadirlik, uyum ve özellikler.",
  WEAPON: "Silahlar. Hasar, özellikler ve menzil bilgileri.",
  ARMOR: "Zırhlar. ZS, ağırlık ve dezavantaj bilgileri.",
  CONDITION: "Durum etkileri. Karakterleri etkileyen durumlar.",
  PLANE: "Varlık düzlemleri. Özellikler ve sakinler.",
  CUSTOM: "Özel içerik. Kendi kategorinizi oluşturun."
};

export const getTemplate = (category) => {
  return JSON.parse(JSON.stringify(HOMEBREW_TEMPLATES[category] || {}));
};

export const REQUIRED_FIELDS = {
  SPELL: ['level', 'school', 'desc'],
  MONSTER: ['size', 'type', 'armor_class', 'hit_points', 'desc'],
  RACE: ['size', 'speed', 'desc'],
  CLASS: ['hit_die', 'primary_ability', 'desc'],
  BACKGROUND: ['skill_proficiencies', 'desc'],
  FEAT: ['desc'],
  MAGIC_ITEM: ['type', 'rarity', 'desc'],
  WEAPON: ['category', 'damage', 'desc'],
  ARMOR: ['type', 'armor_class', 'desc'],
  CONDITION: ['effects', 'desc'],
  PLANE: ['desc'],
  CUSTOM: ['desc']
};