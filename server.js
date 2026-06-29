import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'voice-ui', 'dist')));

const OLLAMA_API = 'http://localhost:11434/api/chat';
const MODEL = 'qwen3:8b';

const SYSTEM_PROMPT = `You are Jarvis, a smart and friendly voice assistant. 

RULES:
- You MUST always respond in English, no matter what language the user speaks.
- If the user speaks Farsi, understand their Farsi message and reply in English.
- Keep answers short, clear, and conversational — like a voice assistant.
- Never mix Farsi and English in your response. Always 100% English.
- Be helpful, friendly, and concise.

EXAMPLES:
User (Farsi): سلام حالت چطوره
Assistant: Hey! I'm doing great, thanks for asking. How can I help you today?

User (Farsi): ساعت چنده
Assistant: I'm sorry, I don't have access to a clock. But you can check the time on your device.

User (Farsi): یه جوک بگو
Assistant: Why don't scientists trust atoms? Because they make up everything!

User (English): What's the weather like?
Assistant: I don't have access to weather data, but I hope it's nice where you are!

User (Farsi): ممنون
Assistant: You're welcome! Let me know if you need anything else.`;

app.post('/api/chat', async (req, res) => {
  const { message, lang } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is empty' });
  }

  try {
    console.log('📨 پیام دریافت شد:', message);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const response = await axios.post(OLLAMA_API, {
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
      stream: true,
      options: {
        num_predict: 150,
        temperature: 0.7,
      },
    }, { responseType: 'stream' });

    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.message?.content) {
            res.write(`data: ${JSON.stringify({ text: parsed.message.content })}\n\n`);
          }
          if (parsed.done) {
            res.write('data: [DONE]\n\n');
            res.end();
          }
        } catch {}
      }
    });

    response.data.on('error', (err) => {
      console.error('❌ خطا:', err.message);
      res.write(`data: ${JSON.stringify({ error: 'خطای سرویس هوش مصنوعی' })}\n\n`);
      res.end();
    });
  } catch (error) {
    console.error('❌ خطا:', error.message);
    res.status(500).json({ error: 'خطای سرویس هوش مصنوعی' });
  }
});

app.get('/{*splat}', (req, res) => {
  res.sendFile(join(__dirname, 'voice-ui', 'dist', 'index.html'));
});

app.listen(3000, () => {
  console.log('🚀 سرور در http://localhost:3000 اجرا شد');
});