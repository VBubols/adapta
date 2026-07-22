import axios from 'axios';

// baseURL vem do .env do Vite (VITE_API_URL); cai pra localhost:3000 no dev.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Anexa o token JWT em toda requisição, se existir.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se o token expirar/for inválido (401), limpa e manda pro login.
api.interceptors.response.use(
  (resposta) => resposta,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
