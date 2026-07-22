import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";
import Usuario from "./usuario.model.js";
import Trilha from "./trilha.model.js";

export const Avaliacao = sequelize.define(
    'Avaliacao',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        trilhaId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        tipo: {
            type: DataTypes.ENUM('diagnostica', 'progresso'),
            allowNull: false
        },
        dificuldade: {
            type: DataTypes.ENUM('iniciante', 'intermediario', 'avancado'),
            allowNull: false
        },
        questoes: {
            type: DataTypes.JSONB,
            allowNull: false
        },
        respostas: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        nota: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        nivel: {
            type: DataTypes.ENUM('iniciante', 'intermediario', 'avancado'),
            allowNull: true
        }
    },
    {
        tableName: 'avaliacao',
        timestamps: true
    }
);

Usuario.hasMany(Avaliacao, { foreignKey: 'userId' });
Avaliacao.belongsTo(Usuario, { foreignKey: 'userId' });
Trilha.hasMany(Avaliacao, { foreignKey: 'trilhaId' });
Avaliacao.belongsTo(Trilha, { foreignKey: 'trilhaId' });

export default Avaliacao;