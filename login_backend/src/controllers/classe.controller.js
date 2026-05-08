import { Turma, Aluno } from '../models/estudante.model.js';
import { Op } from 'sequelize';

export async function listarAlunosEmRisco(req, res) {
    try {
        const alunosEmRisco = await Aluno.findAll({
            attributes: ['nome', 'email', 'mediaGeral'],
            include: {
                model: Turma, 
                attributes: ['nome', 'semestre'],
                where: { semestre: { [ Op.in ]:[ 1,2 ] }}},
            where: { mediaGeral: { [ Op.lt ]: 7.0 } },
            order: [['mediaGeral', 'ASC']]
        });
        return res.status(200).json({mensagem: `Total de alunos em risco: ${alunosEmRisco.length}, Alunos em risco: ${alunosEmRisco}`});
    } catch (error) {
        return res.status(500).json({mensagem: error});
    }
}