import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';
import Usuario from './usuario.model.js';
import Trilha from './trilha.model.js';
import Avaliacao from './avaliacao.model.js';

export const StudyPlan = sequelize.define(
  'StudyPlan',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    trilhaId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    // Qual avaliação (diagnóstico) originou o plano. Nullable: pode nascer sem avaliação.
    avaliacaoId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    cronograma: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    tableName: 'studyplan',
    timestamps: true,
  },
);

Usuario.hasMany(StudyPlan, { foreignKey: 'userId' });
StudyPlan.belongsTo(Usuario, { foreignKey: 'userId' });
Trilha.hasMany(StudyPlan, { foreignKey: 'trilhaId' });
StudyPlan.belongsTo(Trilha, { foreignKey: 'trilhaId' });
Avaliacao.hasMany(StudyPlan, { foreignKey: 'avaliacaoId' });
StudyPlan.belongsTo(Avaliacao, { foreignKey: 'avaliacaoId' });

export default StudyPlan;
