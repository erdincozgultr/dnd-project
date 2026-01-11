// src/components/moderation/VenueModeration.jsx

import React, { useState } from 'react';
import { CheckCircle, XCircle, Archive, Eye, Loader2, MapPin } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import moderationService from '../../services/moderationService';
import { toast } from 'react-toastify';
import ModerationActionModal from './ModerationActionModal';

const VenueModeration = () => {
  const [filter, setFilter] = useState('pending');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [page, setPage] = useState(0);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['mod-venues', filter, page],
    queryFn: () => {
      if (filter === 'pending') {
        return moderationService.getPendingVenues(page, 20);
      }
      const status = filter === 'all' ? null : filter.toUpperCase();
      return moderationService.getAllVenues(status, page, 20);
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, reason, messageToUser }) =>
      moderationService.approveVenue(id, reason, messageToUser),
    onSuccess: () => {
      queryClient.invalidateQueries(['mod-venues']);
      toast.success('✅ Mekan onaylandı');
      setSelectedVenue(null);
      setActionType(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason, messageToUser }) =>
      moderationService.rejectVenue(id, reason, messageToUser),
    onSuccess: () => {
      queryClient.invalidateQueries(['mod-venues']);
      toast.success('❌ Mekan reddedildi');
      setSelectedVenue(null);
      setActionType(null);
    },
  });

  const draftMutation = useMutation({
    mutationFn: ({ id, reason, messageToUser }) =>
      moderationService.moveVenueToDraft(id, reason, messageToUser),
    onSuccess: () => {
      queryClient.invalidateQueries(['mod-venues']);
      toast.success('📦 Mekan drafta alındı');
      setSelectedVenue(null);
      setActionType(null);
    },
  });

  const handleAction = (venue, type) => {
    setSelectedVenue(venue);
    setActionType(type);
  };

  const handleSubmitAction = (data) => {
    const payload = { id: selectedVenue.id, ...data };
    if (actionType === 'approve') approveMutation.mutate(payload);
    else if (actionType === 'reject') rejectMutation.mutate(payload);
    else if (actionType === 'draft') draftMutation.mutate(payload);
  };

  const venues = data?.data?.content || [];

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {['pending', 'published', 'rejected', 'all'].map(f => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(0); }}
            className={`px-4 py-2 rounded-lg font-bold text-sm ${filter === f ? 'bg-cta text-white' : 'bg-cbg text-sti'}`}
          >
            {f === 'pending' && '⏳ Bekleyen'}
            {f === 'published' && '✅ Yayında'}
            {f === 'rejected' && '❌ Reddedilen'}
            {f === 'all' && '📋 Tümü'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={40} className="animate-spin text-cta" />
        </div>
      ) : (
        <div className="space-y-4">
          {venues.map(venue => (
            <div key={venue.id} className="bg-mbg rounded-xl p-4 border border-cbg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-black text-mtf flex items-center gap-2">
                    <MapPin size={18} className="text-green-500" />
                    {venue.name}
                  </h3>
                  <p className="text-sm text-sti">
                    📍 {venue.city}, {venue.district}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold
                  ${venue.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-700' :
                    venue.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'}`}>
                  {venue.status}
                </span>
              </div>

              <div className="flex gap-2 mt-3">
                {venue.status === 'PENDING_APPROVAL' && (
                  <>
                    <button onClick={() => handleAction(venue, 'approve')}
                      className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                      <CheckCircle size={14} /> Onayla
                    </button>
                    <button onClick={() => handleAction(venue, 'reject')}
                      className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                      <XCircle size={14} /> Reddet
                    </button>
                  </>
                )}
                {venue.status === 'PUBLISHED' && (
                  <button onClick={() => handleAction(venue, 'draft')}
                    className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                    <Archive size={14} /> Drafta Al
                  </button>
                )}
                <a href={`/mekanlar/${venue.id}`} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                  <Eye size={14} /> Görüntüle
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedVenue && actionType && (
        <ModerationActionModal
          isOpen={true}
          onClose={() => { setSelectedVenue(null); setActionType(null); }}
          onSubmit={handleSubmitAction}
          title={actionType === 'approve' ? '✅ Mekan Onayla' : actionType === 'reject' ? '❌ Mekan Reddet' : '📦 Drafta Al'}
          itemName={selectedVenue.name}
          actionType={actionType}
        />
      )}
    </div>
  );
};

export default VenueModeration;