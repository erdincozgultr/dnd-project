// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import store from './redux/store';
import Header from './layout/Header';
import Footer from './layout/Footer';
import PageContent from './layout/PageContent';
import { initializeAuth, checkTokenValidity } from './redux/thunks/authThunks';
import { Loader2 } from 'lucide-react';

// Auth Provider - Token kontrolü ve user data yükleme
const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);

  useEffect(() => {
    // Uygulama başlangıcında auth state'i initialize et
    if (isAuthenticated) {
      dispatch(initializeAuth());
    }
  }, []);

  // Token geçerliliğini periyodik kontrol et (her 5 dakikada)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      dispatch(checkTokenValidity());
    }, 5 * 60 * 1000); // 5 dakika

    return () => clearInterval(interval);
  }, [isAuthenticated, dispatch]);

  // İlk yükleme sırasında loading göster
  if (isAuthenticated && isLoading) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-cta mx-auto mb-4" size={48} />
          <p className="text-sti font-bold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return children;
};

// Main App Layout
const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <PageContent />
      </main>
      <Footer />
    </div>
  );
};

// Root App Component
const App = () => {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppLayout />
          </AuthProvider>
          <ToastContainer 
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  );
};

export default App;