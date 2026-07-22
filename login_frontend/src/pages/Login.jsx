import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function fazerLogin(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await login(email, senha);
      navigate('/dashboard');
    } catch (error) {
      setErro(error.response?.data?.mensagem || 'Não foi possível entrar. Verifique os dados.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={fazerLogin}>
        <div className="brand">
          <span className="dot" />
          Adapta
        </div>
        <h1>Entrar</h1>
        <p className="subtitle">Sua plataforma de estudo personalizada por IA.</p>

        {erro && <div className="alert alert-error">{erro}</div>}

        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            className="input"
            type="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="voce@email.com"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            className="input"
            type="password"
            value={senha}
            onChange={(ev) => setSenha(ev.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={carregando}>
          {carregando ? <span className="spinner" /> : 'Entrar'}
        </button>

        <p className="auth-foot">
          Não tem conta? <Link to="/cadastro">Criar conta</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
