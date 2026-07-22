# Adapta — Plataforma de Aprendizagem Adaptativa com IA

Plataforma web em que a **inteligência artificial atua como avaliadora e orientadora pedagógica**: o aluno informa um tema, a IA gera uma trilha de aprendizagem completa, aplica uma avaliação diagnóstica, classifica o nível do estudante e monta um plano de estudo personalizado.

Construída com **React** no front-end, **Node.js + Express** no back-end e **PostgreSQL** como banco de dados, usando a API do **Google Gemini** para a geração de conteúdo pedagógico.

---

## Funcionalidades

**Autenticação**
- Cadastro e login de usuários com senha criptografada (bcrypt).
- Autenticação stateless via JSON Web Token (JWT).
- Gestão de perfil, troca de senha e desativação de conta.

**Trilhas de aprendizagem (geradas por IA)**
- A partir de um tema, a IA gera título, descrição, competências, tópicos e habilidades.
- Cada trilha pertence ao usuário que a criou.

**Avaliação diagnóstica (gerada por IA)**
- Geração automática de questões objetivas derivadas da trilha escolhida.
- Dificuldade configurável (iniciante, intermediário, avançado).
- Correção automática: nota (0–10), classificação de nível e desempenho por tópico.

**Plano de estudo personalizado (gerado por IA)**
- Cronograma em etapas progressivas, do básico ao avançado.
- Quando há um diagnóstico respondido, o plano prioriza as fraquezas do aluno.

---

## Stack

| Camada | Tecnologias |
|---|---|
| Front-end | React 19, Vite, React Router, Axios, CSS (design tokens) |
| Back-end | Node.js, Express 5, Sequelize, JWT, bcryptjs, Zod, Helmet, CORS, rate limiting |
| Banco | PostgreSQL |
| IA | Google Gemini (`@google/genai`, modelo `gemini-3.5-flash`), saída estruturada em JSON validada com Zod |

---

## Estrutura do projeto

```
sistema_login/
├── login_backend/
│   └── src/
│       ├── ai/              # provider da IA (Gemini)
│       ├── config/          # database, cors, helmet, rate limit
│       ├── controllers/     # auth, usuario, trilha, avaliacao, plano
│       ├── middlewares/     # autenticação (JWT), validação (Zod)
│       ├── models/          # Usuario, Trilha, Avaliacao, StudyPlan
│       ├── routes/          # rotas por recurso
│       ├── schemas/         # schemas Zod (entrada e saída da IA)
│       └── app.js           # ponto de entrada
└── login_frontend/
    └── src/
        ├── components/      # Layout, ProtectedRoute
        ├── context/         # AuthContext
        ├── pages/           # Login, Cadastro, Dashboard, Trilha, Avaliacao, Plano, NotFound
        ├── services/        # api.js (axios + interceptors)
        ├── App.jsx
        └── main.jsx
```

---

## Como rodar

### Pré-requisitos
- Node.js v18 ou superior
- PostgreSQL rodando
- Uma chave de API do Google Gemini

### Back-end

```bash
cd login_backend
npm install
```

Crie o arquivo `.env` em `login_backend/src` com base no exemplo:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=sistema_login
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=1d

GEMINI_KEY=sua_chave_do_gemini
```

Inicie o servidor:

```bash
cd src
node app.js
```

O Sequelize sincroniza as tabelas automaticamente na inicialização.

### Front-end

```bash
cd login_frontend
npm install
npm run dev
```

Abre em `http://localhost:5173`. Se a API não estiver em `localhost:3000`, defina `VITE_API_URL` num arquivo `.env`.

---

## Fluxo de uso

1. **Criar conta** e fazer login.
2. No **dashboard**, informar um tema — a IA gera a **trilha**.
3. Abrir a trilha e **gerar a avaliação diagnóstica**.
4. **Responder** a avaliação e receber **nota e nível**.
5. **Gerar o plano de estudo**, personalizado pelo desempenho no diagnóstico.

---

## API

Base URL: `http://localhost:3000`. Rotas de trilha, avaliação e plano exigem o header
`Authorization: Bearer <token>`.

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/cadastro` | Cria um usuário |
| POST | `/auth/login` | Autentica e retorna o token JWT |

### Usuário

| Método | Rota | Descrição |
|---|---|---|
| GET | `/usuario/perfil` | Dados do usuário logado |
| POST | `/usuario/perfil` | Atualiza nome/e-mail |
| POST | `/usuario/senha` | Troca a senha |
| DELETE | `/usuario/conta` | Desativa a conta |

### Trilhas

| Método | Rota | Descrição |
|---|---|---|
| POST | `/trilhas` | Gera uma trilha por IA (body: `{ tema }`) |
| GET | `/trilhas` | Lista as trilhas do usuário |
| GET | `/trilhas/:id` | Detalha uma trilha |

### Avaliações

| Método | Rota | Descrição |
|---|---|---|
| POST | `/avaliacoes` | Gera avaliação por IA (`{ trilhaId, tipo, dificuldade }`) |
| GET | `/avaliacoes` | Lista avaliações (filtro opcional `?trilhaId=`) |
| GET | `/avaliacoes/:id` | Detalha uma avaliação |
| POST | `/avaliacoes/:id/responder` | Corrige (`{ respostas: [índices] }`) e devolve nota, nível e desempenho |

### Planos de estudo

| Método | Rota | Descrição |
|---|---|---|
| POST | `/planos` | Gera plano por IA (`{ trilhaId, avaliacaoId? }`) |
| GET | `/planos` | Lista planos (filtro opcional `?trilhaId=`) |
| GET | `/planos/:id` | Detalha um plano |

---

## Modelo de dados

- **Usuario** — `id` (UUID), `nome`, `email`, `senha` (hash), `ativo`.
- **Trilha** — `id`, `titulo`, `descricao`, `competencias`, `topicos`, `habilidades` (JSONB), `userId`.
- **Avaliacao** — `id`, `userId`, `trilhaId`, `tipo`, `dificuldade`, `questoes` (JSONB), `respostas`, `nota`, `nivel`.
- **StudyPlan** — `id`, `userId`, `trilhaId`, `avaliacaoId`, `cronograma` (JSONB).

Relações: um usuário tem várias trilhas, avaliações e planos; uma trilha tem várias avaliações e planos; um plano pode referenciar a avaliação que o originou.

---

## Decisões de projeto

- **Saída estruturada + validação.** A IA responde em JSON estrito (via `responseJsonSchema` do Gemini), e cada resposta é validada com **Zod** antes de persistir. O mesmo schema Zod é a fonte da verdade tanto para forçar o formato da IA quanto para validar o retorno.
- **Provider desacoplado.** A integração com a IA fica isolada em um único módulo (`ai/gemini.provider.js`), o que permite trocar o provedor sem tocar nos controllers.
- **Persistência em JSONB.** As questões e o cronograma são gravados como JSONB, casando 1:1 com o schema validado, sem normalização desnecessária.
- **Fluxo adaptativo.** O plano de estudo consome o desempenho do diagnóstico para priorizar as fraquezas do aluno.
- **Modelo self-service.** Cada usuário gera e consome as próprias trilhas; não há papel de administrador (RBAC não implementado nesta versão).

---

## Licença

MIT.