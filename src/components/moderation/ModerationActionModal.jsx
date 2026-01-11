// src/components/moderation/ModerationActionModal.jsx

import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const ModerationActionModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  itemName,
  actionType 
}) => {
  const [reason, setReason] = useState('');
  const [messageToUser, setMessageToUser] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (reason.length < 10) {
      setError('Sebep en az 10 karakter olmalıdır');
      return;
    }
    if (reason.length > 500) {
      setError('Sebep maksimum 500 karakter olabilir');
      return;
    }

    setError('');
    onSubmit({ reason, messageToUser });
  };

  const handleClose = () => {
    setReason('');
    setMessageToUser('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cbg">
          <div>
            <h2 className="text-2xl font-black text-mtf">{title}</h2>
            <p className="text-sm text-sti mt-1">
              İçerik: <span className="font-bold">{itemName}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-cbg rounded-lg transition-colors"
          >
            <X size={24} className="text-sti" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900 mb-1">
                Dikkat!
              </p>
              <p className="text-xs text-amber-700">
                Bu işlem kullanıcıya bildirim olarak gönderilecektir. 
                Sebep belirtmeniz zorunludur ve kullanıcı tarafından görülecektir.
              </p>
            </div>
          </div>

          {/* Reason (Required) */}
          <div>
            <label className="block text-sm font-black text-mtf mb-2">
              Sebep <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Moderasyon sebebini açıklayın (min 10, max 500 karakter)"
              className="w-full p-3 border border-cbg rounded-xl focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none resize-none font-medium text-mtf"
              rows={4}
              required
            />
            <p className="text-xs text-sti mt-1">
              {reason.length} / 500 karakter
            </p>
          </div>

          {/* Message to User (Optional) */}
          <div>
            <label className="block text-sm font-black text-mtf mb-2">
              Kullanıcıya Özel Mesaj (Opsiyonel)
            </label>
            <textarea
              value={messageToUser}
              onChange={(e) => setMessageToUser(e.target.value)}
              placeholder="Kullanıcıya gönderilecek özel mesaj (varsa). Bu mesaj notification'da gösterilir."
              className="w-full p-3 border border-cbg rounded-xl focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none resize-none font-medium text-mtf"
              rows={3}
              maxLength={1000}
            />
            <p className="text-xs text-sti mt-1">
              {messageToUser.length} / 1000 karakter
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-bold text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-cbg text-mtf rounded-xl font-bold hover:bg-cbg/70 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className={`
                flex-1 px-6 py-3 rounded-xl font-bold transition-colors
                ${actionType === 'approve' ? 'bg-green-500 hover:bg-green-600' :
                  actionType === 'reject' ? 'bg-red-500 hover:bg-red-600' :
                  'bg-amber-500 hover:bg-amber-600'}
                text-white
              `}
            >
              {actionType === 'approve' && '✅ Onayla'}
              {actionType === 'reject' && '❌ Reddet'}
              {actionType === 'draft' && '📦 Drafta Al'}
              {actionType === 'ban' && '🚫 Yasakla'}
              {actionType === 'unban' && '✅ Yasağı Kaldır'}
              {actionType === 'delete' && '🗑️ Sil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModerationActionModal;