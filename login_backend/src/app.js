import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';

// Importa todos os models pra que o sequelize.sync() conheça as tabelas.
import './models/usuario.model.js';
import './models/trilha.model.js';
import './models/avaliacao.model.js';
import './models/studyplan.model.js';

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/usuario.routes.js';
import avalicaoRouter from './routes/avaliacao.routes.js';
import trilhaRoutes from './routes/trilha.routes.js';
import planoRouter from './routes/plano.routes.js';
import { corsConfig } from './config/cors.js';
import { helmetConfig } from './config/helmt.js';
import { limitadorGlobal } from './config/rateLimit.js';

const app = express();
app.use(express.json());
app.use(cors(corsConfig));
app.use(helmetConfig);
app.use(limitadorGlobal);

app.use('/auth', authRouter);
app.use('/usuario', userRouter);
app.use('/avaliacoes', avalicaoRouter);
app.use('/trilhas', trilhaRoutes);
app.use('/planos', planoRouter);

sequelize.sync({ alter: true }).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Rodando o servidor na porta: ${process.env.PORT}`);
  });
});
