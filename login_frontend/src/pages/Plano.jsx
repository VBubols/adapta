import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api.js';

function Plano() {
  const { id } = useParams();
  const [plano, setPlano] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/planos/${id}`);
        setPlano(data.plano);
      } catch (error) {
        setErro(error.response?.data?.erro || 'Não foi possível carregar o plano.');
      } finally {
        setCarregando(false);
      }
    })();
  }, [id]);

  if (carregando) return <p className="muted">Carregando…</p>;
  if (!plano) return <div className="alert alert-error">{erro || 'Plano não encontrado.'}</div>;

  return (
    <>
      <Link to={`/trilhas/${plano.trilhaId}`} className="muted" style={{ textDecoration: 'none' }}>
        ← Voltar para a trilha
      </Link>
      <h1 style={{ marginTop: 16 }}>Plano de estudo</h1>
      <p className="subtitle">
        Roteiro em {plano.cronograma.length} etapas, do básico ao avançado.
        {plano.avaliacaoId && ' Personalizado a partir do seu diagnóstico.'}
      </p>

      {plano.cronograma.map((etapa, i) => (
        <div className="etapa" key={i}>
          <div className="etapa-head">
            <h3>
              {etapa.etapa} · {etapa.titulo}
            </h3>
            <span className="etapa-tempo">{etapa.tempoEstimado}</span>
          </div>
          <ul>
            {etapa.conteudos.map((c, j) => (
              <li key={j}>{c}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export default Plano;
