import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Casca do app: cabeçalho com marca, navegação e logout.
function Layout({ children }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function sair() {
    logout();
    navigate('/');
  }

  return (
    <>
      <header className="app-header">
        <div className="container">
          <Link to="/dashboard" className="brand">
            <span className="dot" />
            Adapta
          </Link>
          <nav className="app-nav">
            <Link to="/dashboard">Minhas trilhas</Link>
            {usuario && <span className="user">{usuario.nome}</span>}
            <button className="btn btn-ghost" onClick={sair}>
              Sair
            </button>
          </nav>
        </div>
      </header>
      <main className="page">
        <div className="container">{children}</div>
      </main>
    </>
  );
}

export default Layout;
