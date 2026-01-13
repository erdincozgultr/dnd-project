// src/components/moderation/CampaignDetailModal.jsx
import React from 'react';
import { X, Users, Calendar, MapPin, Shield, User } from 'lucide-react';

const CampaignDetailModal = ({ campaign, isOpen, onClose }) => {
  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-cbg p-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-mtf">Campaign Detayları</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cbg rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title & Status */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-black text-mtf">{campaign.title}</h3>
              <span className={`
                px-3 py-1 rounded-lg text-sm font-bold
                ${campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                  campaign.status === 'FULL' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'}
              `}>
                {campaign.status === 'ACTIVE' && '🟢 Aktif'}
                {campaign.status === 'FULL' && '🔴 Dolu'}
                {campaign.status === 'COMPLETED' && '✅ Tamamlandı'}
              </span>
            </div>
            
            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-sti">
              <div className="flex items-center gap-1">
                <User size={16} />
                <span className="font-bold">
                  DM: {campaign.dungeonMaster?.displayName || campaign.dungeonMaster?.username}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{new Date(campaign.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span className="font-bold">
                  {campaign.currentPlayers || 0}/{campaign.maxPlayers || 0} Oyuncu
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {campaign.description && (
            <div>
              <h4 className="font-black text-mtf mb-2">📖 Açıklama</h4>
              <div className="bg-mbg p-4 rounded-lg">
                <p className="text-sm text-sti whitespace-pre-wrap">{campaign.description}</p>
              </div>
            </div>
          )}

          {/* Game System */}
          {campaign.gameSystem && (
            <div>
              <h4 className="font-black text-mtf mb-2">🎲 Oyun Sistemi</h4>
              <div className="bg-mbg p-3 rounded-lg">
                <p className="text-sm font-bold text-mtf">{campaign.gameSystem}</p>
              </div>
            </div>
          )}

          {/* Schedule */}
          {campaign.schedule && (
            <div>
              <h4 className="font-black text-mtf mb-2">📅 Oyun Programı</h4>
              <div className="bg-mbg p-3 rounded-lg">
                <p className="text-sm text-sti">{campaign.schedule}</p>
              </div>
            </div>
          )}

          {/* Location */}
          {(campaign.locationType || campaign.locationDetails) && (
            <div>
              <h4 className="font-black text-mtf mb-2 flex items-center gap-2">
                <MapPin size={18} />
                Lokasyon
              </h4>
              <div className="bg-mbg p-3 rounded-lg space-y-2">
                {campaign.locationType && (
                  <p className="text-sm">
                    <span className="font-bold">Tip:</span> {campaign.locationType}
                  </p>
                )}
                {campaign.locationDetails && (
                  <p className="text-sm text-sti">{campaign.locationDetails}</p>
                )}
              </div>
            </div>
          )}

          {/* Experience Level */}
          {campaign.experienceLevel && (
            <div>
              <h4 className="font-black text-mtf mb-2 flex items-center gap-2">
                <Shield size={18} />
                Deneyim Seviyesi
              </h4>
              <div className="bg-mbg p-3 rounded-lg">
                <p className="text-sm font-bold text-mtf">{campaign.experienceLevel}</p>
              </div>
            </div>
          )}

          {/* Tags */}
          {campaign.tags && campaign.tags.length > 0 && (
            <div>
              <h4 className="font-black text-mtf mb-2">🏷️ Etiketler</h4>
              <div className="flex flex-wrap gap-2">
                {campaign.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-cta/10 text-cta rounded-lg text-sm font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Players */}
          {campaign.players && campaign.players.length > 0 && (
            <div>
              <h4 className="font-black text-mtf mb-2">👥 Oyuncular</h4>
              <div className="space-y-2">
                {campaign.players.map((player, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-mbg rounded-lg"
                  >
                    {player.avatarUrl ? (
                      <img
                        src={player.avatarUrl}
                        alt={player.displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-cta flex items-center justify-center text-white font-bold">
                        {player.displayName?.[0] || player.username?.[0]}
                      </div>
                    )}
                    <span className="font-bold text-mtf">
                      {player.displayName || player.username}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ID Info (for moderation) */}
          <div className="pt-4 border-t border-cbg">
            <p className="text-xs text-sti">
              <span className="font-bold">Campaign ID:</span> {campaign.id}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-cbg p-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cbg text-mtf rounded-lg font-bold hover:bg-cbg/70 transition-colors"
          >
            Kapat
          </button>
          <a
            href={`/campaigns/${campaign.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-cta text-white rounded-lg font-bold hover:bg-cta/90 transition-colors"
          >
            Tam Sayfada Aç
          </a>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailModal;