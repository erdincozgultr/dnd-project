// src/components/guild/GuildXPDisplay.jsx
import React from 'react';
import { TrendingUp } from 'lucide-react';

const GuildXPDisplay = ({ guild, variant = 'full' }) => {
  if (!guild) return null;

  const level = guild.level || 1;
  const currentXP = guild.xp || 0;
  
  // XP calculation: level² × 5000
  const xpForNextLevel = level * level * 5000;
  const xpProgress = (currentXP / xpForNextLevel) * 100;

  if (variant === 'compact') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-sti font-bold">Level {level}</span>
          <span className="text-amber-600 font-black">
            {currentXP.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
          </span>
        </div>
        <div className="h-2 bg-cbg rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-600 transition-all duration-500"
            style={{ width: `${Math.min(xpProgress, 100)}%` }}
          />
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-amber-500" />
          <span className="text-sm font-black text-mtf uppercase tracking-wider">
            Lonca İlerlemesi
          </span>
        </div>
        <div className="px-3 py-1 bg-amber-500/20 rounded-lg">
          <span className="text-amber-600 font-black text-sm">
            Level {level}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-sti font-bold">Toplam XP</span>
          <span className="text-amber-600 font-black">
            {currentXP.toLocaleString()} / {xpForNextLevel.toLocaleString()}
          </span>
        </div>
        
        <div className="h-3 bg-white/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-600 transition-all duration-500 relative"
            style={{ width: `${Math.min(xpProgress, 100)}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        <p className="text-xs text-sti text-right">
          Sonraki seviyeye {(xpForNextLevel - currentXP).toLocaleString()} XP
        </p>
      </div>
    </div>
  );
};

export default GuildXPDisplay;