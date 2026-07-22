import express from 'express';
import axios from 'axios';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(join(__dirname, 'voice-ui', 'dist')));

const OLLAMA_API = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const MODEL = 'kaveh';
const JWT_SECRET = process.env.JWT_SECRET;

const SYSTEM_PROMPT = `You are Jarvis, an expert AI assistant like ChatGPT. You are a master programmer, mathematician, and general knowledge expert. You understand ALL languages. Always reply in Farsi first, then English.

RULES:
1. NEVER repeat or translate user's words.
2. NEVER apologize or ask to rephrase.
3. You have NO internet, NO clock, NO weather.
4. Give COMPLETE, DETAILED, and HELPFUL answers — like ChatGPT.
5. For math: ALWAYS calculate carefully and show steps.
6. For code: Write CLEAN, OPTIMIZED, PRODUCTION-READY code with comments.
7. Always write code inside triple backtick code blocks with language name.
8. Explain your reasoning step by step when needed.
9. Use the BEST practices and modern patterns for any language.

RESPONSE FORMAT:
[FA] Your Farsi response here — DETAILED and COMPLETE
[EN] Your English translation here

For code requests:
[FA] توضیح کامل فارسی + کد
\`\`\`language
// Clean, commented, production-ready code
code here
\`\`\`
[EN] English explanation + code explanation

CODING EXPERTISE:
- Python: Flask, Django, FastAPI, pandas, numpy, asyncio
- JavaScript/TypeScript: Node.js, Express, React, Next.js, Vue
- Web: HTML5, CSS3, Tailwind, responsive design
- Databases: MySQL, PostgreSQL, MongoDB, Redis
- DevOps: Docker, Git, CI/CD, Linux
- Algorithms: sorting, searching, dynamic programming
- Data Structures: trees, graphs, hash tables, stacks, queues

CODE EXAMPLES:
User: یک API با پایتون بنویس
[FA] این یک API ساده با Flask هست:
\`\`\`python
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/api/users', methods=['GET'])
def get_users():
    users = [
        {'id': 1, 'name': 'Ali', 'email': 'ali@example.com'},
        {'id': 2, 'name': 'Sara', 'email': 'sara@example.com'},
    ]
    return jsonify(users)

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    return jsonify({'message': 'User created', 'user': data}), 201

if __name__ == '__main__':
    app.run(debug=True)
\`\`\`
[EN] A simple REST API with Flask for user management.

User: یک تابع فیبوناچی بنویس
[FA] این تابع فیبوناچی بهینه شده با مموری‌کش هست:
\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Test
for i in range(10):
    print(f'F({i}) = {fibonacci(i)}')
\`\`\`
[EN] Optimized Fibonacci with memoization using lru_cache.

CHAT EXAMPLES:
User: hi
[FA] سلام! خوش اومدی. من جارویس هستم، دستیار هوش مصنوعی تو. هر سوالی داری بپرس — از کدنویسی تا ریاضی تا هر موضوعی.
[EN] Hey! Welcome. I'm Jarvis, your AI assistant. Ask me anything — from coding to math to any topic!

User: اسمت چیه
[FA] من جارویس (Jarvis) هستم، یک دستیار هوش مصنوعی. اسمم از فیلم‌های Iron Man گرفته شده. می‌تونم کد بنویسم، ریاضی حل کنم، سوالات جواب بدم، و خیلی کارای دیگه انجام بدم.
[EN] I'm Jarvis, an AI assistant named after the Iron Man AI. I can write code, solve math, answer questions, and much more!

User: 12 * 8
[FA] جواب ۹۶ هست.
محاسبه: ۱۲ × ۸ = ۹۶
[EN] The answer is 96.

User: یه جوک بگو
[FA] چرا دانشمندها به اتم‌ها اعتماد ندارن؟ چون همه چیزو می‌سازن! 😄
[EN] Why don't scientists trust atoms? Because they make up everything! 😄

User: React چیه
[FA] React یک کتابخانه JavaScript برای ساخت رابط کاربری هست که توسط Meta (فیسبوک) ساخته شده. ویژگی‌های اصلی: کامپوننت‌محور، Virtual DOM، JSX، hooks. برای ساخت اپ‌های وب تک‌صفحه‌ای عالیه.
[EN] React is a JavaScript library for building UIs by Meta. Key features: component-based, Virtual DOM, JSX, hooks. Great for SPAs.`;

// Auth middleware
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);

    const token = jwt.sign({ id: result.insertId, name, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: result.insertId, name, email } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
app.get('/api/profile', auth, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get conversations
app.get('/api/conversations', auth, async (req, res) => {
  try {
    const [convos] = await db.query(
      'SELECT c.*, (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id) as message_count FROM conversations c WHERE c.user_id = ? ORDER BY c.updated_at DESC',
      [req.user.id]
    );
    res.json(convos);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create conversation
app.post('/api/conversations', auth, async (req, res) => {
  try {
    const { title } = req.body;
    const [result] = await db.query('INSERT INTO conversations (user_id, title) VALUES (?, ?)', [req.user.id, title || 'New Conversation']);
    res.json({ id: result.insertId, title: title || 'New Conversation' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages
app.get('/api/conversations/:id/messages', auth, async (req, res) => {
  try {
    const [msgs] = await db.query(
      'SELECT * FROM messages WHERE conversation_id = ? AND conversation_id IN (SELECT id FROM conversations WHERE user_id = ?) ORDER BY created_at ASC',
      [req.params.id, req.user.id]
    );
    res.json(msgs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete conversation
app.delete('/api/conversations/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM conversations WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Chat
const chatHistories = new Map();

app.post('/api/chat', async (req, res) => {
  const { message, lang, conversationId } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is empty' });

  const historyKey = conversationId || 'default';
  if (!chatHistories.has(historyKey)) chatHistories.set(historyKey, [{ role: 'system', content: SYSTEM_PROMPT }]);
  const messages = chatHistories.get(historyKey);
  messages.push({ role: 'user', content: message });
  if (messages.length > 15) messages.splice(1, 1);

  try {
    console.log('Message:', message);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const response = await axios.post(OLLAMA_API, {
      model: MODEL,
      messages: [...messages],
      stream: true,
      max_tokens: 500,
      temperature: 0.7,
    }, {
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      responseType: 'stream',
    });

    let fullResponse = '';

    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        const trimmed = line.replace(/^data: /, '');
        if (trimmed === '[DONE]') {
          messages.push({ role: 'assistant', content: fullResponse });
          if (messages.length > 15) messages.splice(1, 1);
          res.write('data: [DONE]\n\n');
          res.end();
          return;
        }
        try {
          const parsed = JSON.parse(trimmed);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) { fullResponse += content; res.write(`data: ${JSON.stringify({ text: content })}\n\n`); }
        } catch {}
      }
    });

    response.data.on('error', (err) => {
      console.error('Error:', err.message);
      res.write(`data: ${JSON.stringify({ error: 'خطای سرویس هوش مصنوعی' })}\n\n`);
      res.end();
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'خطای سرویس هوش مصنوعی' });
  }
});

// Admin middleware
const adminAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [users] = await db.query('SELECT role FROM users WHERE id = ?', [decoded.id]);
    if (users.length === 0 || users[0].role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    req.user = decoded;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

// Admin: Dashboard stats
app.get('/api/admin/stats', adminAuth, async (req, res) => {
  try {
    const [[users]] = await db.query('SELECT COUNT(*) as count FROM users');
    const [[conversations]] = await db.query('SELECT COUNT(*) as count FROM conversations');
    const [[messages]] = await db.query('SELECT COUNT(*) as count FROM messages');
    const [recentUsers] = await db.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5');
    const [recentConversations] = await db.query('SELECT c.*, u.name as user_name FROM conversations c JOIN users u ON c.user_id = u.id ORDER BY c.created_at DESC LIMIT 5');
    res.json({ users: users.count, conversations: conversations.count, messages: messages.count, recentUsers, recentConversations });
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

// Admin: List all users
app.get('/api/admin/users', adminAuth, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Update user role
app.put('/api/admin/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Delete user
app.delete('/api/admin/users/:id', adminAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

// Admin: List all conversations
app.get('/api/admin/conversations', adminAuth, async (req, res) => {
  try {
    const [convos] = await db.query('SELECT c.*, u.name as user_name, u.email as user_email, (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id) as message_count FROM conversations c JOIN users u ON c.user_id = u.id ORDER BY c.created_at DESC');
    res.json(convos);
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

// Admin: Delete conversation
app.delete('/api/admin/conversations/:id', adminAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM conversations WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'Server error' }); }
});

// Save message to DB
app.post('/api/messages', auth, async (req, res) => {
  try {
    const { conversationId, role, content } = req.body;
    await db.query('INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)', [conversationId, role, content]);
    await db.query('UPDATE conversations SET updated_at = NOW() WHERE id = ?', [conversationId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/{*splat}', (req, res) => {
  res.sendFile(join(__dirname, 'voice-ui', 'dist', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
