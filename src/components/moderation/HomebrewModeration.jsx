// src/components/moderation/HomebrewModeration.jsx - FIXED VERSION

import React, { useState } from 'react';
import { 
  CheckCircle, XCircle, Eye, Archive, 
  Loader2, ExternalLink, Calendar
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import moderationService from '../../services/moderationService';
import { toast } from 'react-toastify';
import ModerationActionModal from './ModerationActionModal';

const HomebrewModeration = () => {
  const [filter, setFilter] = useState('pending');
  const [selectedHomebrew, setSelectedHomebrew] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [page, setPage] = useState(0);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['mod-homebrews', filter, page],
    queryFn: () => {
      if (filter === 'pending') {
        return moderationService.getPendingHomebrews(page, 20);
      }
      const status = filter === 'all' ? null : filter.toUpperCase();
      return moderationService.getAllHomebrews(status, page, 20);
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, reason, messageToUser }) =>
      moderationService.approveHomebrew(id, reason, messageToUser),
    onSuccess: () => {
      queryClient.invalidateQueries(['mod-homebrews']);
      toast.success('✅ Homebrew onaylandı');
      setSelectedHomebrew(null);
      setActionType(null);
    },
    onError: () => toast.error('❌ Onaylama başarısız'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason, messageToUser }) =>
      moderationService.rejectHomebrew(id, reason, messageToUser),
    onSuccess: () => {
      queryClient.invalidateQueries(['mod-homebrews']);
      toast.success('❌ Homebrew reddedildi');
      setSelectedHomebrew(null);
      setActionType(null);
    },
    onError: () => toast.error('❌ Reddetme başarısız'),
  });

  const draftMutation = useMutation({
    mutationFn: ({ id, reason, messageToUser }) =>
      moderationService.moveHomebrewToDraft(id, reason, messageToUser),
    onSuccess: () => {
      queryClient.invalidateQueries(['mod-homebrews']);
      toast.success('📦 Homebrew drafta alındı');
      setSelectedHomebrew(null);
      setActionType(null);
    },
    onError: () => toast.error('❌ Drafta alma başarısız'),
  });

  const handleAction = (homebrew, type) => {
    setSelectedHomebrew(homebrew);
    setActionType(type);
  };

  const handleSubmitAction = (data) => {
    const payload = {
      id: selectedHomebrew.id,
      reason: data.reason,
      messageToUser: data.messageToUser || null,
    };

    if (actionType === 'approve') {
      approveMutation.mutate(payload);
    } else if (actionType === 'reject') {
      rejectMutation.mutate(payload);
    } else if (actionType === 'draft') {
      draftMutation.mutate(payload);
    }
  };

  // FIXED: Draft/Pending içerikler için moderator preview
  const handleView = (homebrew) => {
    if (homebrew.status === 'PUBLISHED') {
      // Published ise normal slug ile aç
      window.open(`/homebrew/${homebrew.slug}`, '_blank');
    } else {
      // Draft/Pending ise moderator preview kullan
      window.open(`/mod/homebrew/preview/${homebrew.id}`, '_blank');
    }
  };

  const homebrews = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {['pending', 'published', 'draft', 'all'].map(f => (
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
            {f === 'pending' && '⏳ Bekleyen'}
            {f === 'published' && '✅ Yayında'}
            {f === 'draft' && '📦 Taslak'}
            {f === 'all' && '📋 Tümü'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={40} className="animate-spin text-cta" />
        </div>
      ) : homebrews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sti font-bold">Bu filtre için içerik yok</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {homebrews.map(homebrew => (
              <HomebrewCard
                key={homebrew.id}
                homebrew={homebrew}
                onAction={handleAction}
                onView={handleView}
              />
            ))}
          </div>

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

      {selectedHomebrew && actionType && (
        <ModerationActionModal
          isOpen={true}
          onClose={() => {
            setSelectedHomebrew(null);
            setActionType(null);
          }}
          onSubmit={handleSubmitAction}
          title={
            actionType === 'approve' ? '✅ Homebrew Onayla' :
            actionType === 'reject' ? '❌ Homebrew Reddet' :
            '📦 Drafta Al'
          }
          itemName={selectedHomebrew.title}
          actionType={actionType}
        />
      )}
    </div>
  );
};

const HomebrewCard = ({ homebrew, onAction, onView }) => {
  return (
    <div className="bg-mbg rounded-xl p-4 border border-cbg hover:border-cta transition-all">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-black text-mtf mb-1">
                {homebrew.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-sti">
                <span className="font-bold">
                  👤 {homebrew.author?.displayName || homebrew.author?.username}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(homebrew.createdAt).toLocaleDateString('tr-TR')}
                </span>
                <span className="px-2 py-1 bg-white rounded-lg font-bold">
                  {homebrew.category}
                </span>
              </div>
            </div>

            <span className={`
              px-3 py-1 rounded-lg text-xs font-bold
              ${homebrew.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                homebrew.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'}
            `}>
              {homebrew.status === 'PENDING' && '⏳ Bekliyor'}
              {homebrew.status === 'PUBLISHED' && '✅ Yayında'}
              {homebrew.status === 'DRAFT' && '📦 Taslak'}
            </span>
          </div>

          {homebrew.description && (
            <p className="text-sm text-sti line-clamp-2 mb-3">
              {homebrew.description}
            </p>
          )}

          <div className="flex gap-2">
            {homebrew.status === 'PENDING' && (
              <>
                <button
                  onClick={() => onAction(homebrew, 'approve')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors"
                >
                  <CheckCircle size={14} />
                  Onayla
                </button>
                <button
                  onClick={() => onAction(homebrew, 'reject')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
                >
                  <XCircle size={14} />
                  Reddet
                </button>
              </>
            )}

            {homebrew.status === 'PUBLISHED' && (
              <button
                onClick={() => onAction(homebrew, 'draft')}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors"
              >
                <Archive size={14} />
                Drafta Al
              </button>
            )}

            <button
              onClick={() => onView(homebrew)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors"
            >
              <Eye size={14} />
              Görüntüle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomebrewModeration;