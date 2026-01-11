// src/components/moderation/CampaignModeration.jsx

import React, { useState } from 'react';
import { Trash2, Eye, Loader2, Calendar, Users, Swords } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import moderationService from '../../services/moderationService';
import { toast } from 'react-toastify';
import ModerationActionModal from './ModerationActionModal';

const CampaignModeration = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [page, setPage] = useState(0);

  const queryClient = useQueryClient();

  // Fetch campaigns
  const { data, isLoading } = useQuery({
    queryKey: ['mod-campaigns', page],
    queryFn: () => moderationService.getAllCampaigns(page, 20),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: ({ id, reason, messageToUser }) =>
      moderationService.deleteCampaign(id, reason, messageToUser),
    onSuccess: () => {
      queryClient.invalidateQueries(['mod-campaigns']);
      toast.success('🗑️ Oyun ilanı silindi');
      setSelectedCampaign(null);
      setActionType(null);
    },
    onError: () => toast.error('❌ İşlem başarısız'),
  });

  const handleAction = (campaign, type) => {
    setSelectedCampaign(campaign);
    setActionType(type);
  };

  const handleSubmitAction = (data) => {
    const payload = {
      id: selectedCampaign.id,
      reason: data.reason,
      messageToUser: data.messageToUser || null,
    };

    if (actionType === 'delete') {
      deleteMutation.mutate(payload);
    }
  };

  const campaigns = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div>
      {/* Info Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-bold text-amber-900">
          ⚠️ <strong>Dikkat:</strong> Campaign'ler direkt yayınlanır, onay süreci yoktur. 
          Şikayet gelmesi durumunda kalıcı olarak silebilirsiniz.
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={40} className="animate-spin text-cta" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sti font-bold">Henüz oyun ilanı yok</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {campaigns.map(campaign => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
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

      {/* Delete Confirmation Modal */}
      {selectedCampaign && actionType && (
        <ModerationActionModal
          isOpen={true}
          onClose={() => {
            setSelectedCampaign(null);
            setActionType(null);
          }}
          onSubmit={handleSubmitAction}
          title="🗑️ Oyun İlanını Sil"
          itemName={selectedCampaign.title}
          actionType={actionType}
        />
      )}
    </div>
  );
};

/**
 * Campaign Card Component
 */
const CampaignCard = ({ campaign, onAction }) => {
  return (
    <div className="bg-mbg rounded-xl p-4 border border-cbg hover:border-cta transition-all">
      <div className="flex gap-4">
        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-black text-mtf mb-1 flex items-center gap-2">
                <Swords size={18} className="text-red-500" />
                {campaign.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-sti flex-wrap">
                <span className="font-bold">
                  🎲 {campaign.dungeonMaster?.displayName || campaign.dungeonMaster?.username}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(campaign.createdAt).toLocaleDateString('tr-TR')}
                </span>
                <span className="flex items-center gap-1 font-bold">
                  <Users size={12} />
                  {campaign.currentPlayers || 0}/{campaign.maxPlayers || 0}
                </span>
                <span className={`
                  px-2 py-1 rounded-lg font-bold
                  ${campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    campaign.status === 'FULL' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'}
                `}>
                  {campaign.status === 'ACTIVE' && '🟢 Aktif'}
                  {campaign.status === 'FULL' && '🔴 Dolu'}
                  {campaign.status === 'COMPLETED' && '✅ Tamamlandı'}
                </span>
              </div>
            </div>
          </div>

          {campaign.description && (
            <p className="text-sm text-sti line-clamp-2 mb-3">
              {campaign.description}
            </p>
          )}

          {/* Tags */}
          {campaign.tags && campaign.tags.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {campaign.tags.map((tag, idx) => (
                <span key={idx} className="text-xs px-2 py-1 bg-white rounded-lg font-bold text-sti">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onAction(campaign, 'delete')}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
            >
              <Trash2 size={14} />
              Sil
            </button>

            <a
              href={`/campaigns/${campaign.id}`}
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

export default CampaignModeration;