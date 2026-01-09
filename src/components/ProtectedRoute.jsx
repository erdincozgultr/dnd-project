// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Protected Route Component
 * Kullanıcı giriş yapmadıysa /giris sayfasına yönlendirir
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Token kontrol ediliyor ama user bilgisi henüz gelmemişse loading göster
  const token = localStorage.getItem('authToken');
  if (token && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-mbg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cta mx-auto mb-4"></div>
          <p className="text-mtf">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa login'e yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/giris" replace />;
  }

  // Authenticated ise children'ı render et
  return children;
};

export default ProtectedRoute;