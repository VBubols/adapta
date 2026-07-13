import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({apiKey: ''});

async function gerarTexto() {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: 'Hey rockers hoje é dia mundial do rock pourra'
        });

        console.log('Resposta do Gemini:')
        console.log(response.text);
    } catch (error) {
        console.error(`Erro ao chamar a API: ${error}`)
    };
};

gerarTexto();