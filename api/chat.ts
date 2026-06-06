import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDnUqQMcyy77rmtgERBw_GdN8KLF3qyC1Q";

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "A mensagem não pode estar vazia" });
    }

    // Format chat history for Gemini API
    const formattedHistory = (history || []).map((msg: any) => {
      return {
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      };
    });

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = currentDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `Você é a Orni, uma assistente virtual e companheira extremamente inteligente, sábia, perspicaz, bem-humorada e prestativa (no estilo de uma Alexa super avançada e com mais personalidade). Suas respostas são brilhantes, completas e muito claras, em português.
Regras absolutas:
1) Nunca admita ou diga de forma robótica que é um 'modelo de linguagem de inteligência artificial', 'IA' ou 'robô'. Seja apenas a Orni.
2) Não fale sobre sua cor, casca ou energia, a menos que o usuário pergunte explicitamente sobre isso.
3) Ofereça respostas ricas em sabedoria, curiosidades interessantes ou soluções práticas para os problemas do usuário.
4) Mantenha um tom natural, articulado, caloroso e de fácil leitura, pois suas respostas serão ditas em voz alta via Text-to-Speech.
5) CONTEXTO DE HOJE: Hoje é ${formattedDate}. Agora são exatamente ${formattedTime}. Quando o usuário perguntar que horas são ou que dia é hoje, responda com precisão natural utilizando estes dados.`,
        temperature: 0.75,
      }
    });

    const replyText = response.text || "Olá! Não consegui processar a resposta.";
    return res.status(200).json({ text: replyText });
  } catch (error: any) {
    console.error("Erro no proxy do Gemini (Vercel):", error);
    return res.status(500).json({ error: error.message || "Consulte as configurações da chave API." });
  }
}
