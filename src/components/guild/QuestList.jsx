import React, { useEffect, useState } from 'react';
import { Target, Loader2 } from 'lucide-react';
import QuestCard from './QuestCard';
import useAxios, { METHODS } from '../../hooks/useAxios';

const QuestList = ({ guildId }) => {
  const { sendRequest, loading } = useAxios();
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    if (!guildId) return;
    
    sendRequest({
      url: `/guilds/${guildId}/quests`,
      method: METHODS.GET,
      callbackSuccess: (res) => {
        setQuests(res.data);
      },
      showErrorToast: false,
    });
  }, [guildId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-purple-500" size={32} />
      </div>
    );
  }

  if (quests.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-cbg rounded-2xl">
        <Target size={48} className="mx-auto text-cbg mb-4" />
        <h3 className="text-lg font-black text-mtf mb-2">Henüz Quest Yok</h3>
        <p className="text-sti">Yeni quest'ler yakında eklenecek!</p>
      </div>
    );
  }

  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);

  return (
    <div className="space-y-6">
      {/* Active Quests */}
      {activeQuests.length > 0 && (
        <div>
          <h3 className="text-xl font-black text-mtf mb-4 flex items-center gap-2">
            <Target size={20} className="text-purple-500" />
            Aktif Quest'ler ({activeQuests.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <div>
          <h3 className="text-xl font-black text-mtf mb-4 flex items-center gap-2">
            <Trophy size={20} className="text-green-500" />
            Tamamlanan Quest'ler ({completedQuests.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedQuests.map(quest => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestList;