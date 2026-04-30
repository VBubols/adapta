import Usuario from '../models/usuario.model.js';

export async function perfil(req, res) {
    try {
        const perfil = await Usuario.findByPk(req.usuario.id, { attributes: { exclude: ['senha'] } });
        return res.status(200).json(perfil);
    } catch (error) {
        return res.status(500).json(error); 
    }
};

export async function atualizarPerfil(req, res) {
    try {
        const user = await Usuario.findByPk(req.usuario.id);
        const { nome, email } = req.body;
        const updateData = {};

        if(email){
            const existing = await User.findOne({
                where: {
                    email: email,
                    id: { [Op.ne]: user.id }
                }
            });
            if (existing) {
                return res.status(400).json({ mensagem: 'Email já cadastrado' });
            } else{
                updateData.email = email;
            }
        };

        if(nome){updateData.nome = nome};

        await user.update(updateData);

        const userResponse = user.toJSON();
        delete userResponse.senha;

        return res.status(200).json(userResponse);
    } catch (error) {
        return res.status(500).json(error);
    }
}