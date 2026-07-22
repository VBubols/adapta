import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';
import Usuario from './usuario.model.js'

export const Trilha = sequelize.define(
  'Trilha',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
    },
    competencias: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    topicos: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    habilidades: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
  },
  {
    tableName: 'trilha',
    timestamps: true,
  },
);

Usuario.hasMany(Trilha, { foreignKey: 'userId' });
Trilha.belongsTo(Usuario, { foreignKey: 'userId' });

export default Trilha;
