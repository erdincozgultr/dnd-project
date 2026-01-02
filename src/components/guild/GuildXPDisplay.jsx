// src/components/guild/GuildXPDisplay.jsx
import React from 'react';
import { Zap } from 'lucide-react';

const GuildXPDisplay = ({ guild, variant = 'full' }) => {
  const currentLevel = guild?.level || 1;
  const currentXp = guild?.xp || 0;

  const calculateXpForLevel = (level) => {
    if (level === 1) return 0;
    let totalXp = 0;
    for (let i = 2; i <= level; i++) {
      totalXp += 5000 * i * i;
    }
    return totalXp;
  };

  const xpForCurrentLevel = calculateXpForLevel(currentLevel);
  const xpForNextLevel = calculateXpForLevel(currentLevel + 1);
  const xpInCurrentLevel = currentXp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100);
  const xpRemaining = xpNeededForNextLevel - xpInCurrentLevel;

  if (variant === 'compact') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-purple-500" />
            <span className="text-sm font-bold text-mtf">
              {currentXp.toLocaleString()} XP
            </span>
          </div>
          <span className="text-xs text-sti">Lv.{currentLevel}</span>
        </div>
        <div className="h-1.5 bg-cbg rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black text-mtf flex items-center gap-2">
          <Zap size={24} className="text-purple-500" />
          Lonca Gücü
        </h3>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-sti">Seviye</p>
            <p className="text-3xl font-black text-purple-600">{currentLevel}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-sti">Toplam XP</p>
            <p className="text-2xl font-black text-mtf">{currentXp.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-sti">
          <span>{xpInCurrentLevel.toLocaleString()} XP</span>
          <span>{xpNeededForNextLevel.toLocaleString()} XP</span>
        </div>
        <div className="relative h-6 bg-white rounded-full overflow-hidden border-2 border-purple-200">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-lg">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
        </div>
        <p className="text-sm text-center text-sti">
          Sonraki seviyeye <strong className="text-mtf">{xpRemaining.toLocaleString()} XP</strong>
        </p>
      </div>
      
      <div className="mt-6 p-4 bg-white rounded-xl">
        <p className="text-sm text-sti">
          💡 <strong>XP Kazanma:</strong> Homebrew (+25 XP), Blog (+15 XP), Kampanya (+20 XP)
        </p>
      </div>
    </div>
  );
};

export default GuildXPDisplay;