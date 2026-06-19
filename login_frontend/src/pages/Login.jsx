import { useState } from 'react';
import api from '../services/api.js';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    async function fazerLogin() {
        setErro('');
        setCarregando(true);
        try {
            const resposta = await api.post('/auth/login', { email, senha });
            const { token } = resposta.data;
            localStorage.setItem('token', token);
            console.log('Login feito com sucesso!');  
        } catch (error) {
            const msg = error.response?.data?.mensagem || 'Erro ao fazer login!'
            setErro(msg) 
        } finally {
            setCarregando(false);
        };
    }
    
    return (
        <div className="login-container">
            <input type="email" value={email}  onChange={(event) => setEmail(event.target.value)} placeholder="Digite seu e-mail" />
            <input type="password" value={senha} onChange={(event) => setSenha(event.target.value)} placeholder="Digite sua senha" />
            <button onClick={fazerLogin} disabled={carregando}>
                {carregando ? 'Entrando...' : 'Entrar'}
            </button>
            {erro && <p className="erro">{erro}</p>}
        </div>
    )
}

export default Login;