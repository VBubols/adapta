import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Bloqueia rotas privadas: se não estiver logado, redireciona pro login.
function ProtectedRoute({ children }) {
  const { autenticado } = useAuth();
  if (!autenticado) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute;
