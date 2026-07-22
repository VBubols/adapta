import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api.js';

function Avaliacao() {
  const { id } = useParams();
  const [avaliacao, setAvaliacao] = useState(null);
  const [respostas, setRespostas] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/avaliacoes/${id}`);
        setAvaliacao(data.avaliacao);
        // Se já foi respondida, mostra o gabarito.
        setRespostas(data.avaliacao.respostas || new Array(data.avaliacao.questoes.length).fill(null));
      } catch (error) {
        setErro(error.response?.data?.erro || 'Não foi possível carregar a avaliação.');
      } finally {
        setCarregando(false);
      }
    })();
  }, [id]);

  // Já respondida (veio do banco) ou acabou de ser corrigida.
  const corrigida = Boolean(avaliacao?.respostas) || Boolean(resultado);
  const respondidas = respostas.filter((r) => r !== null).length;

  function escolher(qIndex, altIndex) {
    if (corrigida) return;
    setRespostas((atuais) => {
      const novas = [...atuais];
      novas[qIndex] = altIndex;
      return novas;
    });
  }

  async function enviar() {
    if (respondidas !== avaliacao.questoes.length) return;
    setErro('');
    setEnviando(true);
    try {
      const { data } = await api.post(`/avaliacoes/${id}/responder`, { respostas });
      setAvaliacao(data.avaliacao);
      setResultado(data.resultado);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível enviar as respostas.');
    } finally {
      setEnviando(false);
    }
  }

  function classeAlt(questao, qIndex, altIndex) {
    const selecionada = respostas[qIndex] === altIndex;
    if (!corrigida) return selecionada ? 'alt selecionada' : 'alt';
    // Modo gabarito: verde na correta, vermelho na escolhida errada.
    if (altIndex === questao.respostaCorreta) return 'alt correta';
    if (selecionada) return 'alt errada';
    return 'alt';
  }

  if (carregando) return <p className="muted">Carregando…</p>;
  if (!avaliacao) return <div className="alert alert-error">{erro || 'Avaliação não encontrada.'}</div>;

  return (
    <>
      <Link
        to={`/trilhas/${avaliacao.trilhaId}`}
        className="muted"
        style={{ textDecoration: 'none' }}
      >
        ← Voltar para a trilha
      </Link>

      <h1 style={{ marginTop: 16, textTransform: 'capitalize' }}>
        Avaliação {avaliacao.tipo}
      </h1>

      {corrigida ? (
        <div className="resultado">
          <p className="eyebrow" style={{ color: 'var(--accent)' }}>Seu resultado</p>
          <div className="nota">
            {avaliacao.nota}
            <span> / 10</span>
          </div>
          <div style={{ marginTop: 14 }}>
            <span className={`badge badge-${avaliacao.nivel}`}>Nível: {avaliacao.nivel}</span>
          </div>
          {resultado && (
            <p className="muted" style={{ marginTop: 14 }}>
              Você acertou {resultado.acertos} de {resultado.total} questões.
            </p>
          )}
        </div>
      ) : (
        <p className="subtitle">
          Responda todas as questões e envie para receber sua nota e nível. Dificuldade:{' '}
          {avaliacao.dificuldade}.
        </p>
      )}

      {erro && <div className="alert alert-error">{erro}</div>}

      {avaliacao.questoes.map((questao, qIndex) => (
        <div className="questao" key={qIndex}>
          <div className="questao-num">
            Questão {qIndex + 1} · {questao.topico}
          </div>
          <p className="questao-enunciado">{questao.enunciado}</p>

          {questao.alternativas.map((alt, altIndex) => (
            <label
              key={altIndex}
              className={classeAlt(questao, qIndex, altIndex)}
              onClick={() => escolher(qIndex, altIndex)}
            >
              <input
                type="radio"
                name={`q${qIndex}`}
                checked={respostas[qIndex] === altIndex}
                onChange={() => escolher(qIndex, altIndex)}
                disabled={corrigida}
              />
              <span>{alt}</span>
            </label>
          ))}

          {corrigida && <div className="explicacao">{questao.explicacao}</div>}
        </div>
      ))}

      {!corrigida && (
        <div className="mt">
          <button
            className="btn btn-primary"
            onClick={enviar}
            disabled={enviando || respondidas !== avaliacao.questoes.length}
          >
            {enviando ? (
              <span className="spinner" />
            ) : (
              `Enviar respostas (${respondidas}/${avaliacao.questoes.length})`
            )}
          </button>
        </div>
      )}

      {corrigida && (
        <div className="mt row">
          <Link to={`/trilhas/${avaliacao.trilhaId}`} className="btn btn-ghost">
            Voltar para a trilha
          </Link>
        </div>
      )}
    </>
  );
}

export default Avaliacao;
