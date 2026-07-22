// seed-trilha.js (rode uma vez com: node seed-trilha.js, depois pode apagar)
import dotenv from 'dotenv';
import path from 'node:path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') }); // ajuste se o .env estiver na raiz
import sequelize from './config/database.js';
import Usuario from './models/usuario.model.js';
import Trilha from './models/trilha.model.js';

await sequelize.sync();
let user = await Usuario.findOne();
if (!user) {
  user = await Usuario.create({
    nome: 'Seed User',
    email: 'seed@teste.com',
    senha: 'hash_qualquer', // só pra popular; não passa pelo bcrypt aqui
  });
  console.log('Usuário de teste criado:', user.id);
}
const trilha = await Trilha.create({
  titulo: 'JavaScript para Backend (Node.js & Express)',
  descricao: 'Trilha de fundamentos de backend com Node e Express.',
  competencias: ['APIs REST', 'Persistência com Sequelize'],
  topicos: ['Event Loop', 'Middlewares', 'JWT', 'Sequelize'],
  habilidades: ['Criar rotas', 'Tratar erros assíncronos', 'Validar com Zod'],
  userId: user.id,
});
console.log('Trilha criada, id:', trilha.id);
process.exit(0);