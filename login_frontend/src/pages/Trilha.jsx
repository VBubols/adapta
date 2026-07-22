import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api.js';

function ListaChips({ titulo, itens }) {
  if (!itens?.length) return null;
  return (
    <>
      <h2 className="section-title">{titulo}</h2>
      <ul style={{ margin: 0, paddingLeft: 18, textAlign: 'left', lineHeight: 1.7 }}>
        {itens.map((item, i) => (
          <li key={i} className="muted" style={{ color: 'var(--text)' }}>
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

function Trilha() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trilha, setTrilha] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [dificuldade, setDificuldade] = useState('intermediario');
  const [carregando, setCarregando] = useState(true);
  const [gerandoAval, setGerandoAval] = useState(false);
  const [gerandoPlano, setGerandoPlano] = useState(false);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      const [t, a, p] = await Promise.all([
        api.get(`/trilhas/${id}`),
        api.get(`/avaliacoes?trilhaId=${id}`),
        api.get(`/planos?trilhaId=${id}`),
      ]);
      setTrilha(t.data.trilha);
      setAvaliacoes(a.data.avaliacoes);
      setPlanos(p.data.planos);
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível carregar a trilha.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [id]);

  async function gerarAvaliacao() {
    setErro('');
    setGerandoAval(true);
    try {
      const { data } = await api.post('/avaliacoes', {
        trilhaId: id,
        tipo: 'diagnostica',
        dificuldade,
      });
      navigate(`/avaliacoes/${data.avaliacao.id}`);
    } catch (error) {
      setErro(error.response?.data?.erro || 'A IA não conseguiu gerar a avaliação.');
      setGerandoAval(false);
    }
  }

  async function gerarPlano() {
    setErro('');
    setGerandoPlano(true);
    try {
      // Se houver um diagnóstico já respondido, usa pra personalizar o plano.
      const respondida = avaliacoes.find((a) => a.nivel);
      const { data } = await api.post('/planos', {
        trilhaId: id,
        avaliacaoId: respondida?.id || null,
      });
      navigate(`/planos/${data.plano.id}`);
    } catch (error) {
      setErro(error.response?.data?.erro || 'A IA não conseguiu gerar o plano.');
      setGerandoPlano(false);
    }
  }

  if (carregando) return <p className="muted">Carregando…</p>;
  if (!trilha) return <div className="alert alert-error">{erro || 'Trilha não encontrada.'}</div>;

  return (
    <>
      <Link to="/dashboard" className="muted" style={{ textDecoration: 'none' }}>
        ← Minhas trilhas
      </Link>
      <h1 style={{ marginTop: 16 }}>{trilha.titulo}</h1>
      <p className="subtitle">{trilha.descricao}</p>

      {erro && <div className="alert alert-error">{erro}</div>}

      <div className="row">
        <button className="btn btn-primary" onClick={gerarAvaliacao} disabled={gerandoAval}>
          {gerandoAval ? <span className="spinner" /> : 'Gerar avaliação diagnóstica'}
        </button>
        <select
          className="select"
          style={{ width: 'auto' }}
          value={dificuldade}
          onChange={(e) => setDificuldade(e.target.value)}
          disabled={gerandoAval}
        >
          <option value="iniciante">Iniciante</option>
          <option value="intermediario">Intermediário</option>
          <option value="avancado">Avançado</option>
        </select>
        <button className="btn btn-ghost" onClick={gerarPlano} disabled={gerandoPlano}>
          {gerandoPlano ? <span className="spinner" /> : 'Gerar plano de estudo'}
        </button>
      </div>
      {(gerandoAval || gerandoPlano) && (
        <p className="muted mt">A IA está trabalhando, isso leva alguns segundos…</p>
      )}

      {avaliacoes.length > 0 && (
        <>
          <h2 className="section-title">Avaliações</h2>
          <div className="grid">
            {avaliacoes.map((a) => (
              <Link key={a.id} to={`/avaliacoes/${a.id}`} className="card card-link">
                <div className="between">
                  <h3 style={{ textTransform: 'capitalize' }}>{a.tipo}</h3>
                  {a.nivel ? (
                    <span className={`badge badge-${a.nivel}`}>{a.nivel}</span>
                  ) : (
                    <span className="chip chip-muted">pendente</span>
                  )}
                </div>
                <p>
                  {a.questoes?.length || 0} questões
                  {a.nota != null && ` · nota ${a.nota}`}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}

      {planos.length > 0 && (
        <>
          <h2 className="section-title">Planos de estudo</h2>
          <div className="grid">
            {planos.map((p) => (
              <Link key={p.id} to={`/planos/${p.id}`} className="card card-link">
                <h3>Plano de estudo</h3>
                <p>{p.cronograma?.length || 0} etapas</p>
              </Link>
            ))}
          </div>
        </>
      )}

      <ListaChips titulo="Competências" itens={trilha.competencias} />
      <ListaChips titulo="Tópicos" itens={trilha.topicos} />
      <ListaChips titulo="Habilidades" itens={trilha.habilidades} />
    </>
  );
}

export default Trilha;
