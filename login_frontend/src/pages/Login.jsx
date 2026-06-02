import { useState } from 'react'

function Login() {

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    function fazerLogin() {
        console.log(email)
        console.log(senha)
    }
    
    return (
        <div className="login-container">
            <input type="email" value={email}  onChange={(event) => setEmail(event.target.value)} placeholder="Digite seu e-mail" />
            <input type="password" value={senha} onChange={(event) => setSenha(event.target.value)} placeholder="Digite sua senha" />
            <button onClick={fazerLogin}>Entrar</button>
        </div>
    )
}

export default Login;