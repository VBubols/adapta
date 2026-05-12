# 🔐 Sistema de Login

Backend de autenticação desenvolvido em **Node.js + Express**, projetado para integração com aplicações front-end. Oferece registro e login de usuários com senhas criptografadas, autenticação via JWT e proteção contra abusos com rate limiting.

---

## 🚀 Tecnologias

| Tecnologia | Descrição |
|---|---|
| [Node.js](https://nodejs.org/) | Runtime JavaScript |
| [Express 5](https://expressjs.com/) | Framework web |
| [PostgreSQL](https://www.postgresql.org/) | Banco de dados relacional |
| [Sequelize](https://sequelize.org/) | ORM para PostgreSQL |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Hash de senhas |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | Autenticação via JWT |
| [Helmet](https://helmetjs.github.io/) | Headers de segurança HTTP |
| [CORS](https://github.com/expressjs/cors) | Controle de origens permitidas |
| [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) | Limite de requisições |
| [dotenv](https://github.com/motdotla/dotenv) | Variáveis de ambiente |

---

## 📁 Estrutura do Projeto

```
sistema_de_login/
├── login_backend/
│   └── src/          # Código-fonte da aplicação
├── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [PostgreSQL](https://www.postgresql.org/) instalado e rodando

---

## 🛠️ Instalação e Configuração

**1. Clone o repositório**

```bash
git clone https://github.com/VBubols/sistema_de_login.git
cd sistema_de_login
```

**2. Instale as dependências**

```bash
npm install
```

**3. Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto com base no exemplo abaixo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=sistema_login
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=1d
```

**4. Inicie o servidor**

```bash
# Desenvolvimento (com hot-reload)
npx nodemon

# Produção
node login_backend/src/index.js
```

---

## 📡 Endpoints

> Base URL: `http://localhost:3000`

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/cadastro` | Cria um novo usuário |
| `POST` | `/auth/login` | Autentica e retorna um token JWT |

### Exemplo — Registro

```http
POST /auth/cadastro
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

### Exemplo — Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta de sucesso:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🔒 Segurança

- Senhas armazenadas com hash via **bcryptjs**
- Rotas protegidas com **JWT**
- Headers HTTP seguros via **Helmet**
- Proteção contra brute-force com **express-rate-limit**
- Controle de origens com **CORS**

---

## 🤝 Integração com Front-end

Para consumir esta API no front-end, inclua o token JWT no header de cada requisição autenticada:

```http
Authorization: Bearer <seu_token_aqui>
```

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT**. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.
