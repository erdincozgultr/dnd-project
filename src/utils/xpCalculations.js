// src/utils/xpCalculations.js

/**
 * Rank tier'ları ve XP threshold'ları
 * Backend RankTier enum ile aynı
 */
export const RANK_TIERS = {
  PEASANT: {
    name: 'PEASANT',
    title: 'Köylü',
    minXp: 0,
    maxXp: 99,
    color: 'from-gray-500 to-gray-400'
  },
  ADVENTURER: {
    name: 'ADVENTURER',
    title: 'Maceracı',
    minXp: 100,
    maxXp: 499,
    color: 'from-green-500 to-emerald-400'
  },
  VETERAN: {
    name: 'VETERAN',
    title: 'Kıdemli',
    minXp: 500,
    maxXp: 1499,
    color: 'from-blue-500 to-cyan-400'
  },
  HERO: {
    name: 'HERO',
    title: 'Kahraman',
    minXp: 1500,
    maxXp: 4999,
    color: 'from-purple-500 to-pink-400'
  },
  LEGEND: {
    name: 'LEGEND',
    title: 'Efsane',
    minXp: 5000,
    maxXp: Infinity,
    color: 'from-yellow-500 to-orange-400'
  }
};

/**
 * Mevcut XP'ye göre rank'i döndürür
 */
export const getRankByXp = (xp) => {
  for (const rank of Object.values(RANK_TIERS)) {
    if (xp >= rank.minXp && xp <= rank.maxXp) {
      return rank;
    }
  }
  return RANK_TIERS.PEASANT;
};

/**
 * Sonraki rank'i döndürür
 */
export const getNextRank = (currentRankName) => {
  const ranks = Object.values(RANK_TIERS);
  const currentIndex = ranks.findIndex(r => r.name === currentRankName);
  
  if (currentIndex === -1 || currentIndex === ranks.length - 1) {
    return null;
  }
  
  return ranks[currentIndex + 1];
};

/**
 * XP progress bilgilerini hesaplar
 */
export const calculateXpProgress = (currentXp, currentRankName) => {
  const currentRank = RANK_TIERS[currentRankName] || getRankByXp(currentXp);
  const nextRank = getNextRank(currentRankName);
  
  if (!nextRank) {
    return {
      currentRank,
      nextRank: null,
      xpInCurrentRank: currentXp - currentRank.minXp,
      xpNeededForNextRank: 0,
      xpToNextRank: 0,
      progressPercentage: 100,
      isMaxRank: true
    };
  }
  
  const xpInCurrentRank = currentXp - currentRank.minXp;
  const xpNeededForNextRank = nextRank.minXp - currentRank.minXp;
  const xpToNextRank = nextRank.minXp - currentXp;
  const progressPercentage = Math.min((xpInCurrentRank / xpNeededForNextRank) * 100, 100);
  
  return {
    currentRank,
    nextRank,
    xpInCurrentRank,
    xpNeededForNextRank,
    xpToNextRank,
    progressPercentage: Math.round(progressPercentage),
    isMaxRank: false
  };
};

/**
 * Rank color'ı döndürür
 */
export const getRankColor = (rankName) => {
  const rank = RANK_TIERS[rankName];
  return rank ? rank.color : RANK_TIERS.PEASANT.color;
};