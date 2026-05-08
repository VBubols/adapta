import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Turma from './classe.model.js';

const Aluno = sequelize.define('Aluno', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    nome: { 
        type: DataTypes.STRING,
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    senha: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    mediaGeral: { 
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

Turma.hasMany(Aluno, { foreignKey: 'turmaId' });
Aluno.belongsTo(Turma, { foreignKey: 'turmaId' });

export { Turma, Aluno };