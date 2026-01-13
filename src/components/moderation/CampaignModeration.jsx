// src/components/moderation/CampaignModeration.jsx
import React, { useState } from 'react';
import { Trash2, Eye, Loader2, Calendar, Users, Swords } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import moderationService from '../../services/moderationService';
import { toast } from 'react-toastify';
import ModerationActionModal from './ModerationActionModal';
import CampaignDetailModal from '../partyfinder/CampaignDetailModal';

const CampaignModeration = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [detailModalCampaign, setDetailModalCampaign] = useState(null);
  const [page, setPage] = useState(0);

  const queryClient = useQueryClient();

  // ... existing code ...

  const campaigns = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div>
      {/* ... existing info banner ... */}

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
                onViewDetail={() => setDetailModalCampaign(campaign)} // 👈 YENİ
              />
            ))}
          </div>

          {/* ... existing pagination ... */}
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

      {/* 👇 YENİ: Detail Modal */}
      <CampaignDetailModal
        campaign={detailModalCampaign}
        isOpen={!!detailModalCampaign}
        onClose={() => setDetailModalCampaign(null)}
      />
    </div>
  );
};

/**
 * Campaign Card Component - UPDATED
 */
const CampaignCard = ({ campaign, onAction, onViewDetail }) => { // 👈 onViewDetail prop eklendi
  return (
    <div className="bg-mbg rounded-xl p-4 border border-cbg hover:border-cta transition-all">
      <div className="flex gap-4">
        <div className="flex-1">
          {/* ... existing card content ... */}

          {/* Actions - UPDATED */}
          <div className="flex gap-2">
            <button
              onClick={() => onAction(campaign, 'delete')}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
            >
              <Trash2 size={14} />
              Sil
            </button>

            {/* 👇 DEĞİŞTİRİLDİ: navigate yerine modal aç */}
            <button
              onClick={onViewDetail}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors"
            >
              <Eye size={14} />
              Detayları Gör
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignModeration;