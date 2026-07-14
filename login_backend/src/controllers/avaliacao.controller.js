import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export async function gerarAvalicao(req, res) {
    try {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

        const { conteudo } = req.body;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: conteudo
        });

        return res.status(201).json({resposta: `${response.text}`});
    } catch (error) {
        console.error(error)
        return res.status(500).json({mensagem: `Erro interno: ${error}`})
    };
};