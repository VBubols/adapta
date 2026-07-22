import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { cadastrar } = useAuth();
  const navigate = useNavigate();

  async function fazerCadastro(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await cadastrar(nome, email, senha);
      navigate('/dashboard');
    } catch (error) {
      setErro(error.response?.data?.mensagem || 'Não foi possível criar a conta.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={fazerCadastro}>
        <div className="brand">
          <span className="dot" />
          Adapta
        </div>
        <h1>Criar conta</h1>
        <p className="subtitle">Leva menos de um minuto.</p>

        {erro && <div className="alert alert-error">{erro}</div>}

        <div className="field">
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            className="input"
            value={nome}
            onChange={(ev) => setNome(ev.target.value)}
            placeholder="Seu nome"
            required
          />
        </div>
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
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={carregando}>
          {carregando ? <span className="spinner" /> : 'Criar conta'}
        </button>

        <p className="auth-foot">
          Já tem conta? <Link to="/">Entrar</Link>
        </p>
      </form>
    </div>
  );
}

export default Cadastro;
