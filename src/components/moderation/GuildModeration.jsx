// src/components/moderation/GuildModeration.jsx

import React, { useState } from 'react';
import { Ban, CheckCircle, Eye, Loader2, Users, Shield } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import moderationService from '../../services/moderationService';
import { toast } from 'react-toastify';
import ModerationActionModal from './ModerationActionModal';

const GuildModeration = () => {
  const [filter, setFilter] = useState('all');
  const [selectedGuild, setSelectedGuild] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [page, setPage] = useState(0);

  const queryClient = useQueryClient();

  // Fetch guilds
  const { data, isLoading } = useQuery({
    queryKey: ['mod-guilds', filter, page],
    queryFn: () => {
      if (filter === 'banned') {
        return moderationService.getBannedGuilds(page, 20);
      }
      return moderationService.getAllGuilds(page, 20);
    },
  });

  // Ban mutation
  const banMutation = useMutation({
    mutationFn: ({ id, reason, messageToUser }) =>
      moderationService.banGuild(id, reason, messageToUser),
    onSuccess: () => {
      queryClient.invalidateQueries(['mod-guilds']);
      toast.success('🚫 Lonca yasaklandı');
      setSelectedGuild(null);
      setActionType(null);
    },
    onError: () => toast.error('❌ İşlem başarısız'),
  });

  // Unban mutation
  const unbanMutation = useMutation({
    mutationFn: ({ id, reason, messageToUser }) =>
      moderationService.unbanGuild(id, reason, messageToUser),
    onSuccess: () => {
      queryClient.invalidateQueries(['mod-guilds']);
      toast.success('✅ Lonca yasağı kaldırıldı');
      setSelectedGuild(null);
      setActionType(null);
    },
    onError: () => toast.error('❌ İşlem başarısız'),
  });

  const handleAction = (guild, type) => {
    setSelectedGuild(guild);
    setActionType(type);
  };

  const handleSubmitAction = (data) => {
    const payload = {
      id: selectedGuild.id,
      reason: data.reason,
      messageToUser: data.messageToUser || null,
    };

    if (actionType === 'ban') {
      banMutation.mutate(payload);
    } else if (actionType === 'unban') {
      unbanMutation.mutate(payload);
    }
  };

  const guilds = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'banned'].map(f => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setPage(0);
            }}
            className={`
              px-4 py-2 rounded-lg font-bold text-sm transition-colors
              ${filter === f
                ? 'bg-cta text-white'
                : 'bg-cbg text-sti hover:bg-cbg/70'
              }
            `}
          >
            {f === 'all' && '📋 Tüm Loncalar'}
            {f === 'banned' && '🚫 Yasaklı Loncalar'}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={40} className="animate-spin text-cta" />
        </div>
      ) : guilds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sti font-bold">Bu filtre için lonca yok</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {guilds.map(guild => (
              <GuildCard
                key={guild.id}
                guild={guild}
                onAction={handleAction}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-cbg text-mtf rounded-lg font-bold disabled:opacity-50"
              >
                ← Önceki
              </button>
              <span className="px-4 py-2 bg-white text-mtf font-bold">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 bg-cbg text-mtf rounded-lg font-bold disabled:opacity-50"
              >
                Sonraki →
              </button>
            </div>
          )}
        </>
      )}

      {/* Action Modal */}
      {selectedGuild && actionType && (
        <ModerationActionModal
          isOpen={true}
          onClose={() => {
            setSelectedGuild(null);
            setActionType(null);
          }}
          onSubmit={handleSubmitAction}
          title={actionType === 'ban' ? '🚫 Lonca Yasakla' : '✅ Yasağı Kaldır'}
          itemName={selectedGuild.name}
          actionType={actionType}
        />
      )}
    </div>
  );
};

/**
 * Guild Card Component
 */
const GuildCard = ({ guild, onAction }) => {
  return (
    <div className={`
      bg-mbg rounded-xl p-4 border transition-all
      ${guild.isBanned ? 'border-red-300 bg-red-50/50' : 'border-cbg hover:border-cta'}
    `}>
      <div className="flex gap-4">
        {/* Avatar */}
        {guild.avatarUrl ? (
          <img
            src={guild.avatarUrl}
            alt={guild.name}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield size={32} className="text-white" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-black text-mtf mb-1 flex items-center gap-2">
                {guild.name}
                {guild.isBanned && (
                  <span className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg">
                    YASAKLI
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-3 text-xs text-sti">
                <span className="flex items-center gap-1 font-bold">
                  <Users size={12} />
                  {guild.memberCount || 0} Üye
                </span>
                <span className="font-bold">
                  🎯 Level {guild.level || 1}
                </span>
                <span className="font-bold">
                  👑 {guild.leader?.displayName || guild.leader?.username}
                </span>
              </div>
            </div>
          </div>

          {guild.description && (
            <p className="text-sm text-sti line-clamp-2 mb-3">
              {guild.description}
            </p>
          )}

          {guild.isBanned && guild.banReason && (
            <div className="p-2 bg-red-100 border border-red-200 rounded-lg mb-3">
              <p className="text-xs font-bold text-red-700">
                Yasak Sebebi: {guild.banReason}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {!guild.isBanned ? (
              <button
                onClick={() => onAction(guild, 'ban')}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
              >
                <Ban size={14} />
                Yasakla
              </button>
            ) : (
              <button
                onClick={() => onAction(guild, 'unban')}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors"
              >
                <CheckCircle size={14} />
                Yasağı Kaldır
              </button>
            )}

            <a
              href={`/guilds/${guild.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors"
            >
              <Eye size={14} />
              Görüntüle
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuildModeration;