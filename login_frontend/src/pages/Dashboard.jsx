import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function Dashboard() {
  const { usuario } = useAuth();
  const [trilhas, setTrilhas] = useState([]);
  const [tema, setTema] = useState('');
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState('');

  async function carregarTrilhas() {
    try {
      const { data } = await api.get('/trilhas');
      setTrilhas(data.trilhas);
    } catch {
      setErro('Não foi possível carregar suas trilhas.');
    } finally {
      setCarregandoLista(false);
    }
  }

  useEffect(() => {
    carregarTrilhas();
  }, []);

  async function gerarTrilha(e) {
    e.preventDefault();
    if (!tema.trim()) return;
    setErro('');
    setGerando(true);
    try {
      const { data } = await api.post('/trilhas', { tema });
      setTrilhas((atuais) => [data.trilha, ...atuais]);
      setTema('');
    } catch (error) {
      setErro(error.response?.data?.erro || 'A IA não conseguiu gerar a trilha. Tente de novo.');
    } finally {
      setGerando(false);
    }
  }

  return (
    <>
      <p className="eyebrow">Olá, {usuario?.nome?.split(' ')[0] || 'aluno'}</p>
      <h1>Criar uma trilha de estudo</h1>
      <p className="subtitle">
        Diga um tema e a IA monta uma trilha completa — competências, tópicos e habilidades. Depois
        você pode gerar um diagnóstico e um plano personalizado.
      </p>

      {erro && <div className="alert alert-error">{erro}</div>}

      <form className="input-row" onSubmit={gerarTrilha}>
        <input
          className="input"
          value={tema}
          onChange={(ev) => setTema(ev.target.value)}
          placeholder="Ex: TypeScript para backend com Node.js"
          disabled={gerando}
        />
        <button className="btn btn-primary" type="submit" disabled={gerando || !tema.trim()}>
          {gerando ? <span className="spinner" /> : 'Gerar trilha'}
        </button>
      </form>
      {gerando && <p className="muted mt">A IA está montando sua trilha, isso leva alguns segundos…</p>}

      <h2 className="section-title">Minhas trilhas</h2>

      {carregandoLista ? (
        <p className="muted">Carregando…</p>
      ) : trilhas.length === 0 ? (
        <p className="muted">Você ainda não tem trilhas. Gere a primeira acima.</p>
      ) : (
        <div className="grid">
          {trilhas.map((trilha) => (
            <Link key={trilha.id} to={`/trilhas/${trilha.id}`} className="card card-link">
              <h3>{trilha.titulo}</h3>
              <p>{trilha.descricao}</p>
              <div className="chips">
                <span className="chip chip-muted">{trilha.topicos?.length || 0} tópicos</span>
                <span className="chip chip-muted">
                  {trilha.competencias?.length || 0} competências
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default Dashboard;
