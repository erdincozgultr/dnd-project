// src/components/partyfinder/CampaignDetailModal.jsx - TAMAMEN YENİDEN
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  X, User, MapPin, Swords, CheckCircle, XCircle, Trash2, 
  Monitor, Clock, Users, Crown, Send, Loader2, ExternalLink,
  Calendar, Globe, MessageSquare, AlertCircle, ChevronRight
} from 'lucide-react';
import useAxios, { METHODS } from '../../hooks/useAxios';
import { SYSTEMS, PLATFORMS, FREQUENCIES } from '../../constants/gameEnums';

const CampaignDetailModal = ({ 
  campaign, 
  onClose, 
  user, 
  isAuthenticated, 
  updateList, 
  hasApplied, 
  updateApplications 
}) => {
  const isDM = user && campaign.dungeonMaster?.username === user.username;
  const isOpen = campaign.status === 'OPEN';
  const isFull = campaign.currentPlayers >= campaign.maxPlayers;
  
  const { sendRequest, loading } = useAxios();
  const [applications, setApplications] = useState([]);
  const [viewMode, setViewMode] = useState('details');
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Fetch applications for DM
  useEffect(() => {
    if (isDM && viewMode === 'applications') {
      sendRequest({
        url: `/campaigns/${campaign.id}/applications`,
        method: METHODS.GET,
        callbackSuccess: (res) => setApplications(res.data)
      });
    }
  }, [isDM, viewMode, campaign.id]);

  const handleApply = (data) => {
    sendRequest({
      url: `/campaigns/${campaign.id}/apply`,
      method: METHODS.POST,
      data: { message: data.message },
      callbackSuccess: () => {
        toast.success("Başvurun gönderildi! DM'in yanıtını bekle.");
        if (updateApplications) updateApplications();
        onClose();
      },
      callbackError: (err) => {
        if (err.response?.status === 409) {
          toast.warning("Bu masaya zaten başvurdun!");
        }
      }
    });
  };

  const handleManageApp = (appId, action) => {
    sendRequest({
      url: `/campaigns/applications/${appId}/${action}`,
      method: METHODS.PATCH,
      callbackSuccess: () => {
        toast.success(action === 'accept' ? 'Oyuncu kabul edildi!' : 'Başvuru reddedildi.');
        // Refresh applications
        sendRequest({
          url: `/campaigns/${campaign.id}/applications`,
          method: METHODS.GET,
          callbackSuccess: (res) => setApplications(res.data)
        });
        updateList();
      }
    });
  };

  const handleDelete = () => {
    if (!window.confirm("Bu masayı silmek istediğine emin misin? Bu işlem geri alınamaz!")) return;
    
    sendRequest({
      url: `/campaigns/${campaign.id}`,
      method: METHODS.DELETE,
      callbackSuccess: () => {
        toast.success("Masa silindi.");
        updateList();
        onClose();
      }
    });
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] bg-mbg rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-pb p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-white/10 text-white text-[10px] font-black rounded uppercase">
              {SYSTEMS[campaign.system]}
            </span>
            {isOpen && !isFull ? (
              <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-black rounded-full">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Başvuruya Açık
              </span>
            ) : (
              <span className="px-2 py-1 bg-white/10 text-white/60 text-[10px] font-black rounded-full">
                Kapalı
              </span>
            )}
          </div>

          <h2 className="text-2xl font-black text-white mb-2">{campaign.title}</h2>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cta/30 to-purple-500/30 flex items-center justify-center text-white font-black text-sm">
              {campaign.dungeonMaster?.displayName?.charAt(0) || campaign.dungeonMaster?.username?.charAt(0)}
            </div>
            <div>
              <p className="text-white text-sm font-bold flex items-center gap-1">
                <Crown size={12} className="text-cta" />
                {campaign.dungeonMaster?.displayName || campaign.dungeonMaster?.username}
              </p>
              <p className="text-white/50 text-xs">Dungeon Master</p>
            </div>
          </div>
        </div>

        {/* Tabs for DM */}
        {isDM && (
          <div className="flex border-b border-cbg bg-white">
            <button
              onClick={() => setViewMode('details')}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${
                viewMode === 'details' ? 'text-cta border-b-2 border-cta' : 'text-sti hover:text-mtf'
              }`}
            >
              Detaylar
            </button>
            <button
              onClick={() => setViewMode('applications')}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${
                viewMode === 'applications' ? 'text-cta border-b-2 border-cta' : 'text-sti hover:text-mtf'
              }`}
            >
              Başvurular ({applications.filter(a => a.status === 'PENDING').length})
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {viewMode === 'details' ? (
            <div className="space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <InfoItem icon={<Monitor size={16} />} label="Platform" value={PLATFORMS[campaign.platform]} />
                <InfoItem icon={<Clock size={16} />} label="Sıklık" value={FREQUENCIES[campaign.frequency]} />
                <InfoItem icon={<Users size={16} />} label="Oyuncu" value={`${campaign.currentPlayers}/${campaign.maxPlayers}`} />
                {campaign.levelRange && (
                  <InfoItem icon={<Swords size={16} />} label="Seviye" value={campaign.levelRange} />
                )}
                {campaign.city && (
                  <InfoItem icon={<MapPin size={16} />} label="Konum" value={`${campaign.city}${campaign.district ? `, ${campaign.district}` : ''}`} />
                )}
                {campaign.virtualTableLink && (
                  <a 
                    href={campaign.virtualTableLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-mbg rounded-xl hover:bg-cta/10 transition-colors col-span-2"
                  >
                    <Globe size={16} className="text-cta" />
                    <span className="text-sm font-medium text-mtf">Oyun Linki</span>
                    <ExternalLink size={14} className="text-sti ml-auto" />
                  </a>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-black text-mtf uppercase tracking-wider mb-2">Açıklama</h4>
                <p className="text-sti leading-relaxed">{campaign.description}</p>
              </div>

              {/* Apply Form */}
              {isAuthenticated && !isDM && !hasApplied && isOpen && !isFull && (
                <form onSubmit={handleSubmit(handleApply)} className="space-y-4 pt-4 border-t border-cbg">
                  <h4 className="text-sm font-black text-mtf uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare size={16} className="text-cta" />
                    Başvuru Yap
                  </h4>
                  <textarea
                    {...register('message', { required: 'Bir mesaj yazmalısın' })}
                    rows={3}
                    placeholder="Kendini tanıt, neden bu masaya katılmak istiyorsun?"
                    className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf resize-none focus:border-cta outline-none"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs">{errors.message.message}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-cta text-white rounded-xl font-bold hover:bg-cta-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    Başvuruyu Gönder
                  </button>
                </form>
              )}

              {/* Already Applied */}
              {hasApplied && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle size={20} className="text-green-600" />
                  <div>
                    <p className="font-bold text-green-700">Başvurun Gönderildi</p>
                    <p className="text-green-600 text-sm">DM'in yanıtını bekliyorsun</p>
                  </div>
                </div>
              )}

              {/* Not Authenticated */}
              {!isAuthenticated && (
                <div className="p-4 bg-cbg/30 rounded-xl text-center">
                  <p className="text-sti mb-3">Başvuru yapmak için giriş yapmalısın</p>
                  <Link
                    to="/giris"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-cta text-white rounded-xl font-bold text-sm hover:bg-cta-hover transition-all"
                  >
                    Giriş Yap <ChevronRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            /* Applications View for DM */
            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={40} className="mx-auto text-cbg mb-3" />
                  <p className="text-sti">Henüz başvuru yok</p>
                </div>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="p-4 bg-white border border-cbg rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cta/20 to-purple-500/20 flex items-center justify-center font-black text-cta">
                          {app.playerDisplayName?.charAt(0) || app.playerUsername?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-mtf">{app.playerDisplayName || app.playerUsername}</p>
                          <p className="text-xs text-sti">@{app.playerUsername}</p>
                        </div>
                      </div>
                      <span className={`
                        px-2 py-1 text-[10px] font-black rounded uppercase
                        ${app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                          app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                      `}>
                        {app.status === 'PENDING' ? 'Bekliyor' : app.status === 'ACCEPTED' ? 'Kabul' : 'Red'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-sti mb-3 italic">"{app.message}"</p>
                    
                    {app.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleManageApp(app.id, 'accept')}
                          disabled={isFull}
                          className="flex-1 py-2 bg-green-500 text-white rounded-lg font-bold text-sm hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                        >
                          <CheckCircle size={14} /> Kabul Et
                        </button>
                        <button
                          onClick={() => handleManageApp(app.id, 'reject')}
                          className="flex-1 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                        >
                          <XCircle size={14} /> Reddet
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {isDM && (
          <div className="p-4 border-t border-cbg bg-white flex justify-between items-center">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg font-bold text-sm transition-colors"
            >
              <Trash2 size={16} /> Masayı Sil
            </button>
            <Link
              to={`/kampanya-duzenle/${campaign.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-cbg text-mtf hover:bg-cta hover:text-white rounded-lg font-bold text-sm transition-colors"
            >
              Düzenle
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Helper Component
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-mbg rounded-xl">
    <span className="text-cta">{icon}</span>
    <div>
      <p className="text-[10px] text-sti uppercase font-bold">{label}</p>
      <p className="text-sm font-bold text-mtf">{value}</p>
    </div>
  </div>
);

export default CampaignDetailModal;