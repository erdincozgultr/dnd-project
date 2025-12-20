import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, User, Feather, ShieldCheck, UserCircle } from 'lucide-react';

import useAxios, { METHODS } from '../hooks/useAxios';
import { loginSuccess } from '../redux/actions/authActions';
import { STORAGE_KEYS } from '../api/axiosClient';

const RegisterPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { sendRequest, loading, error } = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = (data) => {
    // Backend: UserRequestDto (username, email, password, displayName)
    sendRequest({
      url: '/auth/register',
      method: METHODS.POST,
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        displayName: data.displayName
      },
      callbackSuccess: (res) => {
        // Backend: AuthResponseDto
        const { accessToken, user } = res.data;
        
        if(accessToken) {
             localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
             localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
             dispatch(loginSuccess({ token: accessToken, user }));
             toast.success("Anlaşma mühürlendi! Aramıza hoş geldin.");
             navigate('/');
        } else {
             // Token dönmezse login sayfasına yönlendirme (opsiyonel akış)
             toast.success("Kayıt Başarılı! Lütfen giriş yap.");
             navigate('/login');
        }
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex bg-mbg">
      <Helmet>
        <title>Kayıt Ol | Zar & Kule</title>
      </Helmet>

      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-pb order-last">
        <img 
          src="https://i.pinimg.com/1200x/58/1e/52/581e52a340c65ca9d0cefca047070f47.jpg" 
          alt="Ancient Contract" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-pb/90 to-transparent"></div>
        
        <div className="relative z-10 p-16 flex flex-col justify-center text-td text-right items-end">
          <Feather size={48} className="text-cta mb-6" />
          <h2 className="text-5xl font-black mb-6 leading-tight">
            Kaderini <br/> İmzala
          </h2>
          <p className="text-lg text-white/70 max-w-md leading-relaxed">
            Bu sadece bir başlangıç. Kendi efsaneni yazmak, loncalara katılmak ve kadim bilgilere erişmek için mühürü bas.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative order-first">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] pointer-events-none"></div>

        <div className="w-full max-w-md">
          
          <div className="mb-10">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-cta/10 text-cta text-xs font-bold rounded-full mb-4">
                <ShieldCheck size={14} /> YENİ MACERACI
             </div>
            <h1 className="text-4xl font-black text-mtf mb-2">Hesap Oluştur</h1>
            <p className="text-sti text-sm">
              Zaten bir hesabın var mı?{' '}
              <Link to="/login" className="font-bold text-cta hover:underline">
                Giriş Yap
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Kullanıcı Adı (YENİ ALAN) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-mtf uppercase tracking-wider ml-1">Kullanıcı Adı (Unique)</label>
              <div className="relative">
                <input 
                  type="text" 
                  {...register("username", { 
                    required: "Kullanıcı adı gerekli",
                    minLength: { value: 3, message: "En az 3 karakter olmalı" },
                    maxLength: { value: 20, message: "En çok 20 karakter olmalı" }
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-cbg rounded-xl focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all text-mtf"
                  placeholder="KullaniciAdi123"
                />
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-sti/50" size={18} />
              </div>
              {errors.username && <span className="text-xs text-red-500 ml-1">{errors.username.message}</span>}
            </div>

            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-mtf uppercase tracking-wider ml-1">Görünen İsim (RP Adı)</label>
              <div className="relative">
                <input 
                  type="text" 
                  {...register("displayName", { required: "Bir isim seçmelisin" })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-cbg rounded-xl focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all text-mtf"
                  placeholder="Örn: Gandalf"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-sti/50" size={18} />
              </div>
              {errors.displayName && <span className="text-xs text-red-500 ml-1">{errors.displayName.message}</span>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-mtf uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  {...register("email", { 
                    required: "Email gerekli",
                    pattern: { value: /^\S+@\S+$/i, message: "Geçersiz email formatı" }
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-cbg rounded-xl focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all text-mtf"
                  placeholder="buyucu@kule.com"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-sti/50" size={18} />
              </div>
              {errors.email && <span className="text-xs text-red-500 ml-1">{errors.email.message}</span>}
            </div>

            {/* Şifre */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-mtf uppercase tracking-wider ml-1">Şifre</label>
              <div className="relative">
                <input 
                  type="password" 
                  {...register("password", { 
                    required: "Şifre gerekli",
                    minLength: { value: 6, message: "En az 6 karakter olmalı" }
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-cbg rounded-xl focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all text-mtf"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sti/50" size={18} />
              </div>
              {errors.password && <span className="text-xs text-red-500 ml-1">{errors.password.message}</span>}
            </div>

            {/* Şifre Tekrar */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-mtf uppercase tracking-wider ml-1">Şifre Onayı</label>
              <div className="relative">
                <input 
                  type="password" 
                  {...register("confirmPassword", { 
                    validate: val => val === password || "Şifreler eşleşmiyor"
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-cbg rounded-xl focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all text-mtf"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sti/50" size={18} />
              </div>
              {errors.confirmPassword && <span className="text-xs text-red-500 ml-1">{errors.confirmPassword.message}</span>}
            </div>

            <button 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-cta text-white py-4 rounded-xl font-bold text-lg hover:bg-pb transition-all shadow-xl hover:shadow-cta/20 hover:-translate-y-1 disabled:opacity-70 mt-4"
            >
              {loading ? 'Parşömen Hazırlanıyor...' : (
                <>
                  <Feather size={20} className="animate-pulse" /> Anlaşmayı İmzala
                </>
              )}
            </button>

            <p className="text-[10px] text-sti/60 text-center px-4">
              Kaydolarak <a href="#" className="underline hover:text-cta">Kule Kuralları</a>'nı ve <a href="#" className="underline hover:text-cta">Gizlilik Büyüsü</a>'nü kabul etmiş olursun.
            </p>

          </form>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;