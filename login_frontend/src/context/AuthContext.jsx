import { createContext, useContext, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario');
    return salvo ? JSON.parse(salvo) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  async function login(email, senha) {
    const { data } = await api.post('/auth/login', { email, senha });
    // O backend responde { token, usuarioResponse }
    const usuarioLogado = data.usuarioResponse;
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(usuarioLogado));
    setToken(data.token);
    setUsuario(usuarioLogado);
    return usuarioLogado;
  }

  async function cadastrar(nome, email, senha) {
    await api.post('/auth/cadastro', { nome, email, senha });
    // Após cadastrar, já autentica o usuário.
    return login(email, senha);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  }

  const value = {
    usuario,
    token,
    autenticado: Boolean(token),
    login,
    cadastrar,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}
