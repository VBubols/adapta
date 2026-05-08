import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Turma = sequelize.define('Turma', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    semestre: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    curso: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default Turma;