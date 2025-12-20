import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { User, Lock, ArrowRight, Dices, KeyRound } from 'lucide-react';

import useAxios, { METHODS } from '../hooks/useAxios';
import { loginSuccess } from '../redux/actions/authActions';
import { STORAGE_KEYS } from '../api/axiosClient'; // Anahtarları buradan alıyoruz

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { sendRequest, loading, error } = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // Backend username bekliyor
    sendRequest({
      url: '/auth/login',
      method: METHODS.POST,
      data: {
        username: data.username, 
        password: data.password
      },
      callbackSuccess: (res) => {
        const { accessToken, user } = res.data;
        // Ortak anahtarları kullanıyoruz
        localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        
        dispatch(loginSuccess({ token: accessToken, user }));
        toast.success(`Tekrar hoş geldin, ${user.displayName || user.username}!`);
        navigate('/');
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex bg-mbg">
      <Helmet><title>Giriş Yap | Zar & Kule</title></Helmet>

      {/* Sol taraf aynı kalıyor... */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-pb">
        <img src="https://i.pinimg.com/736x/bc/8b/f1/bc8bf1e6490e7bd84530dc75f3906831.jpg" alt="Dungeon Gate" className="absolute inset-0 w-full h-full object-cover opacity-60"/>
        <div className="absolute inset-0 bg-gradient-to-r from-pb/80 to-transparent"></div>
        <div className="relative z-10 p-16 flex flex-col justify-center text-td">
          <Dices size={48} className="text-cta mb-6" />
          <h2 className="text-5xl font-black mb-6 leading-tight">Kule'nin Kapıları <br/> Açılıyor...</h2>
          <p className="text-lg text-white/70 max-w-md leading-relaxed">Maceraya kaldığın yerden devam etmek için mühürü kır.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-mtf mb-2">Giriş Yap</h1>
            <p className="text-sti text-sm">Hesabın yok mu? <Link to="/register" className="font-bold text-cta hover:underline">Kayıt Ol</Link></p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
              <KeyRound size={18} /><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-mtf uppercase tracking-wider ml-1">Kullanıcı Adı</label>
              <div className="relative">
                <input 
                  type="text" 
                  {...register("username", { required: "Kullanıcı adı gereklidir" })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-cbg rounded-xl focus:border-cta outline-none text-mtf"
                  placeholder="Kullanıcı adın"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-sti/50" size={18} />
              </div>
              {errors.username && <span className="text-xs text-red-500 ml-1">{errors.username.message}</span>}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-mtf uppercase tracking-wider ml-1">Şifre</label>
              <div className="relative">
                <input 
                  type="password" 
                  {...register("password", { required: "Şifre gereklidir" })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-cbg rounded-xl focus:border-cta outline-none text-mtf"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-sti/50" size={18} />
              </div>
              {errors.password && <span className="text-xs text-red-500 ml-1">{errors.password.message}</span>}
            </div>

            <button disabled={loading} className="w-full flex items-center justify-center gap-2 bg-pb text-td py-4 rounded-xl font-bold text-lg hover:bg-cta hover:text-white transition-all shadow-lg disabled:opacity-70">
              {loading ? 'Giriş Yapılıyor...' : <>Kapıyı Aç <ArrowRight size={20} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;