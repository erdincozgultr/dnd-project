import { Target, Trophy, Clock, CheckCircle } from 'lucide-react';

const QuestCard = ({ quest }) => {
  const isExpiringSoon = () => {
    const hoursLeft = (new Date(quest.deadline) - new Date()) / (1000 * 60 * 60);
    return hoursLeft < 24 && hoursLeft > 0;
  };

  const getTimeLeft = () => {
    const deadline = new Date(quest.deadline);
    const now = new Date();
    const diff = deadline - now;
    
    if (diff < 0) return "Süresi doldu";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} gün ${hours} saat`;
    return `${hours} saat`;
  };

  return (
    <div className={`
      bg-white border-2 rounded-2xl p-6 transition-all
      ${quest.completed 
        ? 'border-green-200 bg-green-50/50' 
        : isExpiringSoon() 
          ? 'border-orange-200 bg-orange-50/50' 
          : 'border-purple-200 hover:border-purple-300'
      }
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${quest.completed 
              ? 'bg-green-500' 
              : 'bg-gradient-to-br from-purple-500 to-pink-500'
            }
          `}>
            {quest.completed ? (
              <CheckCircle size={24} className="text-white" />
            ) : (
              <Target size={24} className="text-white" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-black text-mtf">{quest.title}</h3>
            <p className="text-sm text-sti">{quest.description}</p>
          </div>
        </div>
        
        {/* Reward */}
        <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/10 rounded-lg">
          <Trophy size={16} className="text-yellow-600" />
          <span className="text-sm font-bold text-yellow-600">
            +{quest.xpReward} XP
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-sti mb-2">
          <span>{quest.currentValue} / {quest.targetValue}</span>
          <span>{quest.progressPercentage}%</span>
        </div>
        <div className="h-3 bg-cbg rounded-full overflow-hidden">
          <div 
            className={`
              h-full rounded-full transition-all duration-500
              ${quest.completed 
                ? 'bg-green-500' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }
            `}
            style={{ width: `${quest.progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-sti">
          <Clock size={16} />
          <span className={isExpiringSoon() ? 'text-orange-600 font-bold' : ''}>
            {getTimeLeft()}
          </span>
        </div>
        
        {quest.completed && (
          <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold">
            ✓ Tamamlandı
          </span>
        )}
      </div>
    </div>
  );
};

export default QuestCard;