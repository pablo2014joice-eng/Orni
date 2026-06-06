import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Conversation Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const customHeaderKey = req.headers['x-api-key'] || req.headers['X-Api-Key'];
    const activeKey = (typeof customHeaderKey === 'string' ? customHeaderKey : null) || process.env.GEMINI_API_KEY;

    if (!activeKey) {
      return res.status(401).json({
        error: "GEMINI_API_KEY não configurada. Por favor, cole a sua chave API do Google AI Studio nas configurações (clique em 'Customizar' no menu superior direito do ecrã e configure em 'Chave API do Gemini')."
      });
    }

    const ai = new GoogleGenAI({
      apiKey: activeKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

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
      timeZone: "America/Sao_Paulo", // Standard reliable timezone or generic local time representation
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
    res.json({ text: replyText });
  } catch (error: any) {
    console.error("Erro no proxy do Gemini:", error);
    res.status(500).json({ error: error.message || "Consulte as configurações da chave API." });
  }
});

// Configure Vite middleware or static serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve index.html for SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupVite();
