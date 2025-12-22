import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { User, Lock, ArrowRight, Dices, KeyRound, Loader2 } from 'lucide-react';

import useAxios, { METHODS } from '../hooks/useAxios';
import { loginSuccess } from '../redux/actions/authActions';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { sendRequest, loading } = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    sendRequest({
      url: '/auth/login',
      method: METHODS.POST,
      data: {
        username: data.username, 
        password: data.password
      },
      callbackSuccess: (res) => {
        const { accessToken, user } = res.data;
        
        // Redux'a login bilgisini gönder (localStorage kaydı reducer'da yapılıyor)
        dispatch(loginSuccess({ token: accessToken, user }));
        
        toast.success(`Tekrar hoş geldin, ${user.displayName || user.username}!`);
        navigate('/');
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex bg-mbg">
      <Helmet>
        <title>Giriş Yap | Zar & Kule</title>
      </Helmet>

      {/* Sol taraf - Görsel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-pb">
        <img 
          src="https://i.pinimg.com/736x/bc/8b/f1/bc8bf1e6490e7bd84530dc75f3906831.jpg" 
          alt="Dungeon Gate" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pb/80 to-transparent"></div>
        <div className="relative z-10 p-16 flex flex-col justify-center text-td">
          <Dices size={48} className="text-cta mb-6" />
          <h2 className="text-5xl font-black mb-6 leading-tight">
            Kule'nin Kapıları <br/> Açılıyor...
          </h2>
          <p className="text-lg text-white/70 max-w-md leading-relaxed">
            Maceraya kaldığın yerden devam etmek için mühürü kır.
          </p>
        </div>
      </div>

      {/* Sağ taraf - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-mtf mb-2">Giriş Yap</h1>
            <p className="text-sti text-sm">
              Hesabın yok mu?{' '}
              <Link to="/kayit" className="text-cta font-bold hover:underline">
                Kayıt ol
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-sti" size={18} />
                <input
                  {...register('username', { required: 'Kullanıcı adı gerekli' })}
                  type="text"
                  placeholder="Kullanıcı adın"
                  className="w-full pl-12 pr-4 py-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-sti" size={18} />
                <input
                  {...register('password', { required: 'Şifre gerekli' })}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link 
                to="/sifremi-unuttum" 
                className="text-sm text-sti hover:text-cta transition-colors"
              >
                Şifremi unuttum
              </Link>
            </div>

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
                  Giriş Yap <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cbg"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-mbg px-4 text-sti font-bold">veya</span>
            </div>
          </div>

          {/* Social Login (Placeholder) */}
          <button
            type="button"
            disabled
            className="w-full py-4 rounded-xl font-bold text-sti bg-cbg/50 cursor-not-allowed flex items-center justify-center gap-2"
          >
            <KeyRound size={18} />
            Discord ile Giriş (Yakında)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;