import sequelize from '../config/database';
import { DataTypes } from 'sequelize';

export const Trilha = sequelize.define(
  'Trilha',
  {
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
    adminId: {
      type: DataTypes.NUMBER,
    },
  },
  {
    tableName: 'trilha',
    timestamps: true,
  },
);
