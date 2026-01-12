// src/pages/HomebrewModeratorPreviewPage.jsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Loader2, Eye, CheckCircle, XCircle, Archive } from 'lucide-react';
import moderationService from '../services/moderationService';
import { toast } from 'react-toastify';
import ModerationActionModal from '../components/moderation/ModerationActionModal';

const HomebrewModeratorPreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null);

  // Fetch homebrew
  const { data, isLoading, error } = useQuery({
    queryKey: ['mod-homebrew-preview', id],
    queryFn: () => moderationService.getHomebrewPreview(id),
    enabled: !!id,
  });

  // Mutations
  const approveMutation = useMutation({
    mutationFn: ({ id, reason, messageToUser }) =>
      moderationService.approveHomebrew(id, reason, messageToUser),
    onSuccess: () => {
      toast.success('✅ Homebrew onaylandı');
      navigate('/mod/dashboard');
    },
    onError: () => toast.error('❌ Onaylama başarısız'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason, messageToUser }) =>
      moderationService.rejectHomebrew(id, reason, messageToUser),
    onSuccess: () => {
      toast.success('❌ Homebrew reddedildi');
      navigate('/mod/dashboard');
    },
    onError: () => toast.error('❌ Reddetme başarısız'),
  });

  const draftMutation = useMutation({
    mutationFn: ({ id, reason, messageToUser }) =>
      moderationService.moveHomebrewToDraft(id, reason, messageToUser),
    onSuccess: () => {
      toast.success('📦 Homebrew drafta alındı');
      navigate('/mod/dashboard');
    },
    onError: () => toast.error('❌ Drafta alma başarısız'),
  });

  const handleSubmitAction = (data) => {
    const payload = {
      id: homebrew.id,
      reason: data.reason,
      messageToUser: data.messageToUser || null,
    };

    if (actionType === 'approve') approveMutation.mutate(payload);
    else if (actionType === 'reject') rejectMutation.mutate(payload);
    else if (actionType === 'draft') draftMutation.mutate(payload);
  };

  const homebrew = data?.data;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-cta" />
      </div>
    );
  }

  // Error state
  if (error || !homebrew) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 max-w-md text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-mtf mb-2">Homebrew Bulunamadı</h2>
          <p className="text-sm text-sti mb-4">
            Bu homebrew bulunamadı veya erişim izniniz yok.
          </p>
          <Link
            to="/mod/dashboard"
            className="inline-block px-6 py-3 bg-cta text-white rounded-xl font-bold hover:opacity-90"
          >
            ← Dashboard'a Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mbg pb-20 font-display">
      {/* Warning Banner */}
      <div className="bg-amber-500 text-white py-3 px-4">
        <div className="container mx-auto max-w-4xl flex items-center gap-3">
          <Eye size={20} />
          <p className="font-bold text-sm">
            MODERATÖR ÖNİZLEME - Status: {homebrew.status}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Status Badge */}
        <div className="mb-4">
          <span
            className={`
            inline-block px-4 py-2 rounded-lg font-bold text-sm
            ${
              homebrew.status === 'PENDING_APPROVAL'
                ? 'bg-amber-100 text-amber-700'
                : homebrew.status === 'DRAFT'
                ? 'bg-gray-100 text-gray-700'
                : 'bg-green-100 text-green-700'
            }
          `}
          >
            {homebrew.status === 'PENDING_APPROVAL' && '⏳ Onay Bekliyor'}
            {homebrew.status === 'DRAFT' && '📦 Taslak'}
            {homebrew.status === 'PUBLISHED' && '✅ Yayında'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex gap-3">
          {homebrew.status === 'PENDING_APPROVAL' && (
            <>
              <button
                onClick={() => {
                  setActionType('approve');
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
              >
                <CheckCircle size={18} />
                Onayla
              </button>
              <button
                onClick={() => {
                  setActionType('reject');
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
              >
                <XCircle size={18} />
                Reddet
              </button>
            </>
          )}

          {homebrew.status === 'PUBLISHED' && (
            <button
              onClick={() => {
                setActionType('draft');
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors"
            >
              <Archive size={18} />
              Drafta Al
            </button>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black text-mtf mb-4">{homebrew.name}</h1>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-sti mb-6 flex-wrap">
          <span className="font-bold">
            👤 {homebrew.author?.displayName || homebrew.author?.username}
          </span>
          <span className="font-bold">
            📅 {new Date(homebrew.createdAt).toLocaleDateString('tr-TR')}
          </span>
          <span className="px-3 py-1 bg-cbg rounded-lg font-bold">
            {homebrew.categoryDisplayName || homebrew.category}
          </span>
        </div>

        {/* Description */}
        {homebrew.description && (
          <div className="bg-white rounded-xl shadow-lg border border-cbg p-6 mb-6">
            <h2 className="text-xl font-black text-mtf mb-3">Açıklama</h2>
            <p className="text-mtf leading-relaxed">{homebrew.description}</p>
          </div>
        )}

        {/* Content - JSON Format */}
        <div className="bg-white rounded-xl shadow-lg border border-cbg p-6 mb-6">
          <h2 className="text-xl font-black text-mtf mb-4">İçerik</h2>
          {homebrew.content ? (
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
              {JSON.stringify(homebrew.content, null, 2)}
            </pre>
          ) : (
            <p className="text-sti">İçerik bulunamadı</p>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            to="/mod/dashboard"
            className="inline-block px-6 py-3 bg-cta text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            ← Moderasyon Paneline Dön
          </Link>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ModerationActionModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setActionType(null);
          }}
          onSubmit={handleSubmitAction}
          title={
            actionType === 'approve'
              ? '✅ Homebrew Onayla'
              : actionType === 'reject'
              ? '❌ Homebrew Reddet'
              : '📦 Homebrew Drafta Al'
          }
          itemName={homebrew.name}
          actionType={actionType}
        />
      )}
    </div>
  );
};

export default HomebrewModeratorPreviewPage;