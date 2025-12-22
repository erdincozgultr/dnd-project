import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, User, Feather, UserCircle, Loader2, AlertCircle } from 'lucide-react';

import useAxios, { METHODS } from '../hooks/useAxios';
import { loginSuccess } from '../redux/actions/authActions';

const RegisterPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { sendRequest, loading } = useAxios();
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
        displayName: data.displayName || data.username
      },
      callbackSuccess: (res) => {
        const { accessToken, user } = res.data;
        
        if (accessToken) {
          // Redux'a login bilgisini gönder (localStorage kaydı reducer'da yapılıyor)
          dispatch(loginSuccess({ token: accessToken, user }));
          toast.success("Anlaşma mühürlendi! Aramıza hoş geldin.");
          navigate('/');
        } else {
          // Token dönmezse login sayfasına yönlendirme
          toast.success("Kayıt başarılı! Lütfen giriş yap.");
          navigate('/giris');
        }
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex bg-mbg">
      <Helmet>
        <title>Kayıt Ol | Zar & Kule</title>
      </Helmet>

      {/* Sol taraf - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-mtf mb-2">Kayıt Ol</h1>
            <p className="text-sti text-sm">
              Zaten hesabın var mı?{' '}
              <Link to="/giris" className="text-cta font-bold hover:underline">
                Giriş yap
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                Kullanıcı Adı *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-sti" size={18} />
                <input
                  {...register('username', { 
                    required: 'Kullanıcı adı gerekli',
                    minLength: { value: 3, message: 'En az 3 karakter' },
                    maxLength: { value: 20, message: 'En fazla 20 karakter' },
                    pattern: { 
                      value: /^[a-zA-Z0-9_]+$/, 
                      message: 'Sadece harf, rakam ve alt çizgi' 
                    }
                  })}
                  type="text"
                  placeholder="maceraci_42"
                  className="w-full pl-12 pr-4 py-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.username.message}
                </p>
              )}
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                Görünen İsim
              </label>
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-sti" size={18} />
                <input
                  {...register('displayName', {
                    maxLength: { value: 30, message: 'En fazla 30 karakter' }
                  })}
                  type="text"
                  placeholder="Aragorn (opsiyonel)"
                  className="w-full pl-12 pr-4 py-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all"
                />
              </div>
              {errors.displayName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.displayName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                E-posta *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-sti" size={18} />
                <input
                  {...register('email', { 
                    required: 'E-posta gerekli',
                    pattern: { 
                      value: /^\S+@\S+$/i, 
                      message: 'Geçerli bir e-posta girin' 
                    }
                  })}
                  type="email"
                  placeholder="maceraci@zarvekule.com"
                  className="w-full pl-12 pr-4 py-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                Şifre *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-sti" size={18} />
                <input
                  {...register('password', { 
                    required: 'Şifre gerekli',
                    minLength: { value: 6, message: 'En az 6 karakter' }
                  })}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                Şifre Tekrar *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-sti" size={18} />
                <input
                  {...register('confirmPassword', { 
                    required: 'Şifre tekrarı gerekli',
                    validate: value => value === password || 'Şifreler eşleşmiyor'
                  })}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                {...register('terms', { required: 'Koşulları kabul etmelisin' })}
                type="checkbox"
                className="w-5 h-5 mt-0.5 rounded border-cbg text-cta focus:ring-cta"
              />
              <label className="text-sm text-sti">
                <Link to="/kullanim-kosullari" className="text-cta hover:underline">
                  Kullanım koşullarını
                </Link>{' '}
                ve{' '}
                <Link to="/gizlilik" className="text-cta hover:underline">
                  gizlilik politikasını
                </Link>{' '}
                okudum ve kabul ediyorum.
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle size={12} /> {errors.terms.message}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-4 rounded-xl font-black text-white uppercase tracking-wider 
                flex items-center justify-center gap-2 transition-all
                ${loading 
                  ? 'bg-cbg cursor-not-allowed' 
                  : 'bg-cta hover:bg-cta-hover shadow-lg shadow-cta/30 hover:shadow-cta/50'}
              `}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Feather size={18} /> Mühürü Bas
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Sağ taraf - Görsel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-pb">
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
            Bu sadece bir başlangıç. Kendi efsaneni yazmak, loncalara katılmak 
            ve kadim bilgilere erişmek için mühürü bas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;