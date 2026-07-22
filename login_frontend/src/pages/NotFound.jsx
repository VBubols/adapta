import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="auth-wrap">
      <div className="center">
        <p className="eyebrow">Erro 404</p>
        <h1>Página não encontrada</h1>
        <p className="subtitle center" style={{ margin: '0 auto 24px' }}>
          O endereço que você tentou acessar não existe.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          Ir para minhas trilhas
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
