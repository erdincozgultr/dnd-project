import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { 
  X, User, MapPin, Swords, CheckCircle, XCircle, Trash2 
} from 'lucide-react';
import useAxios, { METHODS } from '../../hooks/useAxios';
import { SYSTEMS, PLATFORMS, FREQUENCIES } from '../../constants/gameEnums';

const CampaignDetailModal = ({ campaign, onClose, user, isAuthenticated, updateList, hasApplied, updateApplications }) => {
    const isDM = user && campaign.dungeonMaster.username === user.username;
    
    // Admin veya Moderatör kontrolü yapılabilir (örneğin user.roles.includes('ADMIN') gibi)
    // Şimdilik sadece DM'in kendi ilanını silmesine izin veriyoruz ama backend zaten yetkiyi kontrol edecek.
    const canDelete = isDM; 

    const { sendRequest, loading } = useAxios();
    
    const [applications, setApplications] = useState([]);
    const [viewMode, setViewMode] = useState('details'); 

    const { register, handleSubmit, formState: { errors } } = useForm();

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
                toast.success("Mühürlü kuzgun yola çıktı! (Başvurun İletildi)");
                if (updateApplications) updateApplications(); 
                onClose(); 
            },
            callbackError: (err) => {
                if (err.response && err.response.status === 409) {
                    toast.warning("Zaten bir başvurunuz var!");
                } else {
                    toast.error("Bir hata oluştu.");
                }
            }
        });
    };

    const handleManageApp = (appId, action) => {
        sendRequest({
            url: `/campaigns/applications/${appId}/${action}`,
            method: METHODS.PATCH,
            callbackSuccess: () => {
                toast.success(action === 'accept' ? 'Maceracı ekibe katıldı!' : 'Başvuru reddedildi.');
                sendRequest({
                    url: `/campaigns/${campaign.id}/applications`,
                    method: METHODS.GET,
                    callbackSuccess: (res) => setApplications(res.data)
                });
                updateList();
            }
        });
    };

    // --- SİLME FONKSİYONU ---
    const handleDelete = () => {
        if (!window.confirm("Bu masayı kalıcı olarak dağıtmak istediğine emin misin? Bu işlem geri alınamaz!")) return;

        sendRequest({
            url: `/campaigns/${campaign.id}`,
            method: METHODS.DELETE,
            callbackSuccess: () => {
                toast.info("Masa başarıyla dağıtıldı (silindi).");
                updateList(); // Listeyi güncelle
                onClose(); // Modalı kapat
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-pb/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in font-display">
            <div className="bg-mbg w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-cbg relative flex flex-col ring-1 ring-white/10">
                
                {/* Header */}
                <div className="bg-pb p-6 sticky top-0 z-10 flex justify-between items-start border-b border-white/10 shadow-lg">
                    <div>
                        <h2 className="text-2xl font-black text-white leading-tight drop-shadow-md">{campaign.title}</h2>
                        <div className="flex items-center gap-3 mt-2 text-white/70 text-sm font-medium">
                            <span className="bg-cta px-2 py-0.5 rounded text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">{SYSTEMS[campaign.system]}</span>
                            <span className="flex items-center gap-1"><User size={12}/> {campaign.dungeonMaster.displayName}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors p-1 bg-white/5 rounded-full hover:bg-white/10">
                        <X size={24} />
                    </button>
                </div>

                {/* DM Toolbar */}
                {isDM && (
                    <div className="flex border-b border-cbg bg-mbg sticky top-[88px] z-10">
                        <button 
                            onClick={() => setViewMode('details')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${viewMode === 'details' ? 'border-cta text-cta bg-cta/5' : 'border-transparent text-sti hover:text-mtf'}`}
                        >
                            İlan Detayları
                        </button>
                        <button 
                            onClick={() => setViewMode('applications')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 ${viewMode === 'applications' ? 'border-cta text-cta bg-cta/5' : 'border-transparent text-sti hover:text-mtf'}`}
                        >
                            Başvurular {applications.length > 0 && `(${applications.length})`}
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="p-6 space-y-6 bg-mbg">
                    {viewMode === 'details' ? (
                        <>
                            {/* Detail Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                <div className="bg-white p-3 rounded-xl border border-cbg shadow-sm">
                                    <p className="text-[10px] text-cta font-black uppercase mb-1">Platform</p>
                                    <p className="font-bold text-mtf text-xs">{PLATFORMS[campaign.platform]}</p>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-cbg shadow-sm">
                                    <p className="text-[10px] text-cta font-black uppercase mb-1">Sıklık</p>
                                    <p className="font-bold text-mtf text-xs">{FREQUENCIES[campaign.frequency]}</p>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-cbg shadow-sm">
                                    <p className="text-[10px] text-cta font-black uppercase mb-1">Kontenjan</p>
                                    <p className="font-bold text-mtf text-xs">{campaign.currentPlayers} / {campaign.maxPlayers}</p>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-cbg shadow-sm">
                                    <p className="text-[10px] text-cta font-black uppercase mb-1">Seviye</p>
                                    <p className="font-bold text-mtf text-xs">{campaign.levelRange || '-'}</p>
                                </div>
                            </div>
                            
                            {/* Location */}
                            {campaign.platform === 'FACE_TO_FACE' && (
                                <div className="flex items-center gap-3 text-sm text-mtf bg-gradient-to-r from-orange-50 to-white p-4 rounded-xl border border-orange-100 shadow-sm">
                                    <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] text-orange-600 font-black uppercase">Konum</span>
                                        <span className="font-bold">{campaign.city}</span>
                                        {campaign.district && <span className="text-sti">, {campaign.district}</span>}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="bg-white/50 p-4 rounded-xl border border-cbg/50">
                                <h3 className="text-sm font-black text-mtf mb-3 uppercase tracking-wide border-b border-cbg/30 pb-2">Hikaye & Detaylar</h3>
                                <div className="text-sti leading-relaxed whitespace-pre-wrap text-sm font-medium">
                                    {campaign.description}
                                </div>
                            </div>
                            
                            {/* Apply Form */}
                            {!isDM && campaign.status === 'OPEN' && isAuthenticated && (
                                <div className="mt-4 pt-4 border-t border-cbg">
                                    {hasApplied ? (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                                            <CheckCircle size={32} className="text-green-500 mb-2" />
                                            <h3 className="text-green-700 font-bold text-lg">Başvurun Alındı!</h3>
                                            <p className="text-green-600 text-sm">DM yanıt verdiğinde bildirim alacaksın.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit(handleApply)} className="space-y-3">
                                            <h3 className="text-sm font-black text-mtf mb-3 uppercase flex items-center gap-2">
                                                <Swords size={16} className="text-cta" /> Maceraya Katıl
                                            </h3>
                                            <textarea 
                                                {...register("message", { required: "Mesaj zorunludur" })}
                                                className="w-full p-4 border border-cbg rounded-xl bg-white focus:border-cta focus:ring-1 focus:ring-cta outline-none text-sm min-h-[100px] placeholder:text-sti/50 font-medium transition-all shadow-inner"
                                                placeholder="Karakter fikrin veya deneyimin..."
                                            ></textarea>
                                            {errors.message && <span className="text-xs text-red-500 font-bold ml-1">{errors.message.message}</span>}
                                            <button disabled={loading} className="w-full bg-cta text-white py-3.5 rounded-xl font-black text-sm hover:bg-pb transition-all shadow-lg">
                                                {loading ? 'Kuzgun Uçuruluyor...' : 'Başvuruyu Gönder'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        // --- APPLICATIONS LIST ---
                        <div className="space-y-4">
                            {applications.length === 0 ? (
                                <div className="text-center py-12 bg-white/50 rounded-xl border border-dashed border-cbg">
                                    <div className="bg-cbg/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <User size={24} className="text-sti" />
                                    </div>
                                    <p className="text-mtf font-bold">Henüz başvuru yok.</p>
                                </div>
                            ) : (
                                applications.map(app => (
                                    <div key={app.id} className="bg-white border border-cbg p-4 rounded-xl flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                            app.status === 'ACCEPTED' ? 'bg-green-500' : 
                                            app.status === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-500'
                                        }`}></div>

                                        <div className="flex items-center gap-3 pl-2">
                                            <img 
                                                src={app.player.avatarUrl || `https://ui-avatars.com/api/?name=${app.player.displayName}&background=random`} 
                                                className="w-10 h-10 rounded-full border border-cbg" 
                                            />
                                            <div>
                                                <p className="font-bold text-mtf text-sm">{app.player.displayName}</p>
                                                <p className="text-[10px] text-sti font-bold">{new Date(app.appliedAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="ml-auto">
                                                <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider ${
                                                    app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                                    app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-mbg p-3 rounded-lg border border-cbg/30 text-sm text-sti italic font-medium ml-2">
                                            "{app.message}"
                                        </div>
                                        {app.status === 'PENDING' && (
                                            <div className="flex gap-2 mt-1 ml-2">
                                                <button onClick={() => handleManageApp(app.id, 'accept')} className="flex-1 bg-green-50 text-green-600 py-2.5 rounded-lg text-xs font-black hover:bg-green-500 hover:text-white transition-colors flex items-center justify-center gap-1 border border-green-200">
                                                    <CheckCircle size={14} /> KABUL ET
                                                </button>
                                                <button onClick={() => handleManageApp(app.id, 'reject')} className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-lg text-xs font-black hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-1 border border-red-200">
                                                    <XCircle size={14} /> REDDET
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* DANGER ZONE: DELETE CAMPAIGN */}
                    {canDelete && (
                         <div className="mt-8 pt-6 border-t border-red-100">
                            <button 
                                onClick={handleDelete}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-bold text-sm rounded-xl border border-red-200 hover:bg-red-600 hover:text-white transition-all hover:shadow-lg"
                            >
                                <Trash2 size={16} /> İlanı Sil (Masayı Dağıt)
                            </button>
                            <p className="text-[10px] text-center text-red-400 mt-2">
                                Dikkat: Bu işlem geri alınamaz ve tüm başvurular silinir.
                            </p>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampaignDetailModal;