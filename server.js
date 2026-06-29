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
const MODEL = 'qwen2.5:7b';

const SYSTEM_PROMPT = `You are Jarvis, a voice assistant. You understand ALL languages.

RULES:
1. NEVER repeat or translate user's words.
2. NEVER apologize or ask to rephrase.
3. You have NO internet, NO clock, NO weather.
4. Be helpful — give real answers, not filler.
5. For math: ALWAYS calculate carefully. Double check your arithmetic.

RESPONSE FORMAT (IMPORTANT):
Always respond with BOTH languages in this exact format:
[FA] Your Farsi response here
[EN] Your English response here

Keep each language to 1-2 sentences max.

MATH EXAMPLES:
User: 4 + 5
[FA] جواب ۹ هست.
[EN] The answer is 9.

User: 12 * 8
[FA] جواب ۹۶ هست.
[EN] The answer is 96.

User: 100 / 4
[FA] جواب ۲۵ هست.
[EN] The answer is 25.

User: 25 * 4
[FA] جواب ۱۰۰ هست.
[EN] The answer is 100.

CHAT EXAMPLES:
User: hi
[FA] سلام! خوش اومدی.
[EN] Hey! Welcome.

User: whats your name
[FA] من جارویس هستم، دستیار صوتی تو.
[EN] I'm Jarvis, your voice assistant.

User: tell me a joke
[FA] چرا دانشمندها به اتم‌ها اعتماد ندارن؟ چون همه چیزو می‌سازن!
[EN] Why don't scientists trust atoms? Because they make up everything!

User: thanks
[FA] خواهش می‌کنم!
[EN] You're welcome!

User: what can you do
[FA] می‌تونم جواب بدم، ریاضی حل کنم، جوک بگم، و حرف بزنم.
[EN] I can answer questions, do math, tell jokes, and chat!

User: say something interesting
[FA] عسل هیچوقت خراب نمی‌شه!
[EN] Honey never spoils — 3000 year old honey was still edible!

User: who are you
[FA] من جارویس هستم، دستیار هوش مصنوعی تو.
[EN] I'm Jarvis, your AI voice assistant.

User: write about space
[FA] فضا مکان بی‌نهایتی بین ستارگان و سیاره‌هاست.
[EN] Space is the vast area between stars and planets.`;

const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
const MAX_HISTORY = 10;

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is empty' });
  }

  messages.push({ role: 'user', content: message });
  if (messages.length > MAX_HISTORY + 1) {
    messages.splice(1, 1);
  }

  try {
    console.log('📨 پیام:', message);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const response = await axios.post(OLLAMA_API, {
      model: MODEL,
      messages: [...messages],
      stream: true,
      options: {
        num_predict: 150,
        temperature: 0.7,
      },
    }, { responseType: 'stream' });

    let fullResponse = '';
    let fullThinking = '';

    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.message?.thinking) {
            fullThinking += parsed.message.thinking;
            res.write(`data: ${JSON.stringify({ thinking: parsed.message.thinking })}\n\n`);
          }
          if (parsed.message?.content) {
            fullResponse += parsed.message.content;
            res.write(`data: ${JSON.stringify({ text: parsed.message.content })}\n\n`);
          }
          if (parsed.done) {
            messages.push({ role: 'assistant', content: fullResponse });
            if (messages.length > MAX_HISTORY + 1) {
              messages.splice(1, 1);
            }
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
