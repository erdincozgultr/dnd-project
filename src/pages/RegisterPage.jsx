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
        const { accessToken, user } = res.data;
        
        if(accessToken) {
          // SADECE TOKEN'I SAKLIYORUZ
          localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
          
          // USER BİLGİSİ SADECE REDUX'TA
          dispatch(loginSuccess({ token: accessToken, user }));
          
          toast.success("Anlaşma mühürlendi! Aramıza hoş geldin.");
          navigate('/');
        } else {
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

      {/* Sağ taraf - Görsel Alan */}
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

      {/* Sol taraf - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative order-first">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          
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
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Kullanıcı Adı */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-mtf uppercase tracking-wider ml-1">
                Kullanıcı Adı (Unique)
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  {...register("username", { 
                    required: "Kullanıcı adı gerekli",
                    minLength: { value: 3, message: "En az 3 karakter olmalı" },
                    maxLength: { value: 20, message: "En çok 20 karakter olmalı" },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "Sadece harf, rakam ve alt çizgi kullanılabilir"
                    }
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-cbg rounded-xl focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-all text-mtf"
                  placeholder="kullanici_adi"
                  autoComplete="username"
                />
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-sti/50" size={18} />
              </div>
              {errors.username && (
                <span className="text-xs text-red-500 ml-1">{errors.username.message}</span>
              )}
            </div>

            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-mtf uppercase tracking-wider ml-1">
                Görünen İsim (RP Adı)
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  {...register("displayName", { 
                    required: "Görünen isim gerekli",
                    minLength: { value: 2, message: "En az 2 karakter olmalı" },
                    maxLength: { value: 30, message: "En çok 30 karakter olmalı" }
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-cbg rounded-xl focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-all text-mtf"
                  placeholder="Karanlık Şövalye"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-sti/50" size={18} />
              </div>
              {errors.displayName && (
                <span className="text-xs text-red-500 ml-1">{errors.displayName.message}</span>
              )}
              <p className="text-[10px] text-sti/70 ml-1">Bu isim diğer oyunculara gösterilecek</p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-mtf uppercase tracking-wider ml-1">
                E-posta
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  {...register("email", { 
                    required: "E-posta gerekli",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Geçerli bir e-posta adresi girin"
                    }
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-cbg rounded-xl focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-all text-mtf"
                  placeholder="ornek@email.com"
                  autoComplete="email"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-sti/50" size={18} />
              </div>
              {errors.email && (
                <span className="text-xs text-red-500 ml-1">{errors.email.message}</span>
              )}
            </div>

            {/* Şifre */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-mtf uppercase tracking-wider ml-1">
                Şifre
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  {...register("password", { 
                    required: "Şifre gerekli",
                    minLength: { value: 6, message: "En az 6 karakter olmalı" }
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-cbg rounded-xl focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-all text-mtf"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sti/50" size={18} />
              </div>
              {errors.password && (
                <span className="text-xs text-red-500 ml-1">{errors.password.message}</span>
              )}
            </div>

            {/* Şifre Tekrar */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-mtf uppercase tracking-wider ml-1">
                Şifre Tekrar
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  {...register("passwordConfirm", { 
                    required: "Şifre tekrarı gerekli",
                    validate: value => value === password || "Şifreler eşleşmiyor"
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-cbg rounded-xl focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-all text-mtf"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sti/50" size={18} />
              </div>
              {errors.passwordConfirm && (
                <span className="text-xs text-red-500 ml-1">{errors.passwordConfirm.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button 
              disabled={loading} 
              className="w-full flex items-center justify-center gap-2 bg-pb text-td py-4 rounded-xl font-bold text-lg hover:bg-cta hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-6"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-td/30 border-t-td rounded-full animate-spin"></div>
                  Kayıt Yapılıyor...
                </span>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Mühürü Bas
                </>
              )}
            </button>
          </form>

          {/* Kullanım Şartları */}
          <p className="text-[10px] text-sti/70 text-center mt-6">
            Kayıt olarak{' '}
            <Link to="/terms" className="text-cta hover:underline">Kullanım Şartları</Link>
            {' '}ve{' '}
            <Link to="/privacy" className="text-cta hover:underline">Gizlilik Politikası</Link>
            'nı kabul ediyorsun.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;