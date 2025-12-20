// src/components/settings/AccountSettings.jsx - GÜNCELLEME
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  Shield, Mail, Lock, Save, Loader2, Eye, EyeOff, AlertTriangle
} from 'lucide-react';
import useAxios, { METHODS } from '../../hooks/useAxios';
import { updateUserSummary } from '../../redux/actions/authActions';

const AccountSettings = ({ user }) => {
  const dispatch = useDispatch();
  const { sendRequest, loading } = useAxios();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Email Form
  const emailForm = useForm({
    defaultValues: { email: user?.email || '' }
  });

  // Password Form
  const passwordForm = useForm();

  const onEmailSubmit = (data) => {
    sendRequest({
      url: '/users/me',
      method: METHODS.PATCH,
      data: { email: data.email },
      callbackSuccess: (res) => {
        toast.success('E-posta güncellendi!');
        dispatch(updateUserSummary(res.data));
      },
    });
  };

  const onPasswordSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Şifreler eşleşmiyor!');
      return;
    }

    sendRequest({
      url: '/users/me',
      method: METHODS.PATCH,
      data: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      callbackSuccess: () => {
        toast.success('Şifre güncellendi!');
        passwordForm.reset();
      },
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-black text-mtf uppercase tracking-tight flex items-center gap-2 mb-2">
          <Shield size={24} className="text-cta" />
          Hesap Ayarları
        </h2>
        <p className="text-sti text-sm">E-posta ve şifre bilgilerini güncelle</p>
      </div>

      {/* Email Section */}
      <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="bg-white border border-cbg rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-black text-mtf flex items-center gap-2 mb-4">
          <Mail size={20} className="text-blue-500" />
          E-posta Adresi
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
              E-posta
            </label>
            <input
              {...emailForm.register('email', {
                required: 'E-posta gerekli',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Geçerli bir e-posta girin'
                }
              })}
              type="email"
              className="w-full p-3 bg-mbg border border-cbg rounded-xl text-mtf font-medium focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all"
            />
            {emailForm.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">{emailForm.formState.errors.email.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !emailForm.formState.isDirty}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all
                ${loading || !emailForm.formState.isDirty
                  ? 'bg-cbg text-sti cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'}
              `}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              E-postayı Güncelle
            </button>
          </div>
        </div>
      </form>

      {/* Password Section */}
      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="bg-white border border-cbg rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-black text-mtf flex items-center gap-2 mb-4">
          <Lock size={20} className="text-purple-500" />
          Şifre Değiştir
        </h3>

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
              Mevcut Şifre
            </label>
            <div className="relative">
              <input
                {...passwordForm.register('currentPassword', { required: 'Mevcut şifre gerekli' })}
                type={showPasswords.current ? 'text' : 'password'}
                className="w-full p-3 pr-12 bg-mbg border border-cbg rounded-xl text-mtf font-medium focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sti hover:text-mtf transition-colors"
              >
                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
              Yeni Şifre
            </label>
            <div className="relative">
              <input
                {...passwordForm.register('newPassword', { 
                  required: 'Yeni şifre gerekli',
                  minLength: { value: 6, message: 'En az 6 karakter' }
                })}
                type={showPasswords.new ? 'text' : 'password'}
                className="w-full p-3 pr-12 bg-mbg border border-cbg rounded-xl text-mtf font-medium focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sti hover:text-mtf transition-colors"
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordForm.formState.errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
              Yeni Şifre (Tekrar)
            </label>
            <div className="relative">
              <input
                {...passwordForm.register('confirmPassword', { required: 'Şifre tekrarı gerekli' })}
                type={showPasswords.confirm ? 'text' : 'password'}
                className="w-full p-3 pr-12 bg-mbg border border-cbg rounded-xl text-mtf font-medium focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sti hover:text-mtf transition-colors"
              >
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all
                ${loading
                  ? 'bg-cbg text-sti cursor-not-allowed'
                  : 'bg-purple-500 text-white hover:bg-purple-600'}
              `}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              Şifreyi Değiştir
            </button>
          </div>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h3 className="text-lg font-black text-red-600 flex items-center gap-2 mb-2">
          <AlertTriangle size={20} />
          Tehlikeli Bölge
        </h3>
        <p className="text-red-600/70 text-sm mb-4">
          Bu işlemler geri alınamaz. Dikkatli ol!
        </p>
        <button
          type="button"
          className="px-6 py-2.5 rounded-xl font-bold text-sm bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
          onClick={() => toast.info('Bu özellik yakında eklenecek')}
        >
          Hesabımı Sil
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;