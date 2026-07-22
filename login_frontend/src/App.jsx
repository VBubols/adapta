import { Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Trilha from './pages/Trilha.jsx';
import Avaliacao from './pages/Avaliacao.jsx';
import Plano from './pages/Plano.jsx';
import NotFound from './pages/NotFound.jsx';

// Envolve páginas privadas com o layout (cabeçalho + navegação) e o guard.
function Privada({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Privada><Dashboard /></Privada>} />
        <Route path="/trilhas/:id" element={<Privada><Trilha /></Privada>} />
        <Route path="/avaliacoes/:id" element={<Privada><Avaliacao /></Privada>} />
        <Route path="/planos/:id" element={<Privada><Plano /></Privada>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
