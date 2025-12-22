import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import PageContent from "./layout/PageContent";
import { loginSuccess, logout } from "./redux/actions/authActions";
import { STORAGE_KEYS } from "./api/axiosClient";
import axiosClient from "./api/axiosClient";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Uygulama yüklendiğinde token varsa user bilgisini backend'den çek
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      
      // Token varsa ama user bilgisi yoksa (sayfa yenilendiğinde)
      if (token && !user) {
        try {
          // Backend'den mevcut kullanıcı bilgisini al
          // Backend'inizde /api/auth/me veya /api/users/me endpoint'i olmalı
          const response = await axiosClient.get('/auth/me');
          
          // User bilgisini Redux'a kaydet
          dispatch(loginSuccess({ 
            token, 
            user: response.data 
          }));
        } catch (error) {
          // Token geçersizse veya süresi dolmuşsa
          console.error('Token doğrulama hatası:', error);
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          dispatch(logout());
        }
      }
    };

    initializeAuth();
  }, [dispatch, user]);

  return (
    <div className="min-h-screen flex flex-col font-display bg-mbg text-mtf">
      <Header />

      <main className="flex-grow">
        <PageContent />
      </main>

      <Footer />
    </div>
  );
}

export default App;