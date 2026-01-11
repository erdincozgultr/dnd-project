// src/pages/HomebrewModeratorPreviewPage.jsx
// Draft/Pending homebrew'ları görüntülemek için moderator preview page

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, Loader2, Eye } from 'lucide-react';
import moderationService from '../services/moderationService';
import { useAuth } from '../contexts/AuthContext';

const HomebrewModeratorPreviewPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  // Check if user is moderator or admin
  const isModerator = user?.roles?.includes('MODERATOR') || user?.roles?.includes('ADMIN');

  // Fetch homebrew with moderator preview endpoint
  const { data, isLoading, error } = useQuery({
    queryKey: ['mod-homebrew-preview', id],
    queryFn: () => moderationService.getHomebrewPreview(id),
    enabled: isModerator && !!id,
  });

  // Redirect if not moderator
  if (!isModerator) {
    return <Navigate to="/" />;
  }

  const homebrew = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-cta" />
      </div>
    );
  }

  if (error || !homebrew) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-mtf text-center mb-2">
            Homebrew Bulunamadı
          </h2>
          <p className="text-sm text-sti text-center">
            Bu homebrew bulunamadı veya erişim izniniz yok.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mbg pb-20 font-display">
      <Helmet>
        <title>{homebrew.title} - Moderator Preview | Zar & Kule</title>
      </Helmet>

      {/* Moderator Warning Banner */}
      <div className="bg-amber-500 text-white py-3 px-4">
        <div className="container mx-auto max-w-4xl flex items-center gap-3">
          <Eye size={20} />
          <p className="font-bold text-sm">
            MODERATÖR ÖNIZLEME: Bu içerik {homebrew.status} durumunda ve henüz yayınlanmamış.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Status Badge */}
        <div className="mb-4">
          <span className={`
            inline-block px-4 py-2 rounded-lg font-bold text-sm
            ${homebrew.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
              homebrew.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
              'bg-green-100 text-green-700'}
          `}>
            {homebrew.status === 'PENDING' && '⏳ Onay Bekliyor'}
            {homebrew.status === 'DRAFT' && '📦 Taslak'}
            {homebrew.status === 'PUBLISHED' && '✅ Yayında'}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black text-mtf mb-4">
          {homebrew.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-sti mb-6">
          <span className="font-bold">
            👤 {homebrew.author?.displayName || homebrew.author?.username}
          </span>
          <span className="font-bold">
            📅 {new Date(homebrew.createdAt).toLocaleDateString('tr-TR')}
          </span>
          <span className="px-3 py-1 bg-cbg rounded-lg font-bold">
            {homebrew.category}
          </span>
        </div>

        {/* Description */}
        {homebrew.description && (
          <div className="bg-white rounded-xl shadow-lg border border-cbg p-6 mb-6">
            <h2 className="text-xl font-black text-mtf mb-3">Açıklama</h2>
            <p className="text-mtf leading-relaxed">{homebrew.description}</p>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg border border-cbg p-6">
          <h2 className="text-xl font-black text-mtf mb-4">İçerik</h2>
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: homebrew.content }}
          />
        </div>

        {/* Back to Dashboard */}
        <div className="mt-6 text-center">
          <a
            href="/mod/dashboard"
            className="inline-block px-6 py-3 bg-cta text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            ← Moderasyon Paneline Dön
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomebrewModeratorPreviewPage;