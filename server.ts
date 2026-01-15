/**
 * Standalone Backend Server for Better Auth
 * This server runs independently to handle authentication for the React Native app
 * API routes are organized in the app/api directory for better structure
 */
import { config } from 'dotenv';
import { resolve } from 'node:path';

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') });

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { auth } from './lib/auth';
import { BattleService } from './services/battleService';
import { VoteService } from './services/voteService';

const app = express();
const PORT = Number(process.env.PORT) || 8000;

// Helper function to authenticate user from session token
const authenticateUser = async (req: express.Request): Promise<string> => {
  const sessionToken = req.cookies['better-auth.session_token'];
  
  if (!sessionToken) {
    throw new Error('Unauthorized - No session token');
  }

  // 直接查询数据库验证 session
  const { db } = await import('./db/index');
  const { session } = await import('./drizzle/schema');
  const { eq } = await import('drizzle-orm');
  
  const sessions = await db.select().from(session).where(eq(session.token, sessionToken));
  
  if (sessions.length === 0 || new Date(sessions[0].expiresAt) < new Date()) {
    throw new Error('Unauthorized - Invalid or expired session');
  }

  return sessions[0].userId;
};

// Enable CORS for React Native app
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
}));

// Cookie parser middleware - must be before routes that need cookies
app.use(cookieParser());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Better Auth handler - catch all /api/auth/* routes
app.all('/api/auth/*', async (req, res) => {
  try {
    // Create a Web Request object from Express request
    const url = new URL(req.originalUrl, `http://${req.headers.host || 'localhost'}`);
    const webRequest = new Request(url, {
      method: req.method,
      headers: new Headers(req.headers as Record<string, string>),
      body: ['GET', 'HEAD'].includes(req.method) ? null : JSON.stringify(req.body),
    });

    // Handle with Better Auth
    const response = await auth.handler(webRequest);

    // Convert Web Response to Express response
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Battles API routes
app.get('/api/battles', async (req, res) => {
  try {
    const battles = await BattleService.getAllWithImplementations();
    res.json({ data: battles, total: battles.length });
  } catch (error) {
    console.error('Error fetching battles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/battles/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const battle = await BattleService.getByIdWithImplementations(id);
    if (!battle) {
      return res.status(404).json({ error: 'Battle not found' });
    }
    res.json({ data: battle });
  } catch (error) {
    console.error('Error fetching battle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/battles', async (req, res) => {
  try {
    const userId = await authenticateUser(req);
    
    console.log('[Battles API] Raw request body:', req.body);
    console.log('[Battles API] Content-Type:', req.headers['content-type']);
    
    const { title, description, category, implementations } = req.body;

    console.log('[Battles API] Parsed data:', { title, description, category, implementations });
    console.log('[Battles API] Types:', { 
      title: typeof title, 
      description: typeof description, 
      category: typeof category,
      implementations: Array.isArray(implementations) ? 'array' : typeof implementations
    });

    // 验证必需字段
    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Missing required fields: title, description, category' });
    }

    if (!implementations || !Array.isArray(implementations) || implementations.length < 2) {
      return res.status(400).json({ error: 'At least 2 implementations are required' });
    }

    // 验证每个 implementation
    for (const impl of implementations) {
      if (!impl.title || !impl.description || !impl.code || !impl.author) {
        return res.status(400).json({ 
          error: 'Each implementation must have title, description, code, and author' 
        });
      }
    }

    // 创建 battle
    const newBattle = await BattleService.createWithImplementations({
      title,
      description,
      category,
      createdBy: userId,
      implementations: implementations.map((impl: any) => ({
        title: impl.title,
        description: impl.description,
        code: impl.code,
        author: impl.author,
        authorId: userId,
        pros: impl.pros || [],
        cons: impl.cons || [],
        tags: impl.tags || [],
      })),
    });

    console.log('[Battles API] Battle created successfully:', newBattle.id);
    res.status(201).json({ data: newBattle });
  } catch (error: any) {
    console.error('[Battles API] Error:', error);
    if (error.message.includes('Unauthorized')) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
});

// Votes API routes - 直接查询数据库验证 session
app.get('/api/votes', async (req, res) => {
  try {
    const userId = await authenticateUser(req);
    const votes = await VoteService.getUserVotes(userId);
    res.json({ data: votes, total: votes.length });
  } catch (error: any) {
    console.error('[Votes API] Error:', error);
    res.status(error.message.includes('Unauthorized') ? 401 : 500).json({ error: error.message || 'Internal server error' });
  }
});

app.post('/api/votes', async (req, res) => {
  try {
    const userId = await authenticateUser(req);
    const { implementationId } = req.body;

    console.log('[Votes API] User:', userId, 'voting for implementation:', implementationId);

    if (!implementationId) {
      return res.status(400).json({ error: 'implementationId is required' });
    }

    const result = await VoteService.vote(userId, parseInt(implementationId));
    console.log('[Votes API] Vote successful:', result);
    
    res.json({ data: { success: true, implementationId: parseInt(implementationId) } });
  } catch (error: any) {
    console.error('[Votes API] Error:', error);
    if (error.message === 'User has already voted for this implementation') {
      res.status(409).json({ error: error.message });
    } else if (error.message.includes('Unauthorized')) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug endpoint to check cookies
app.get('/api/debug/cookies', (req, res) => {
  res.json({
    cookies: req.cookies,
    headers: req.headers,
    rawCookie: req.headers.cookie,
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
  console.log(`Better Auth endpoints available at http://0.0.0.0:${PORT}/api/auth/*`);
  console.log(`Battles API available at http://0.0.0.0:${PORT}/api/battles`);
  console.log(`Votes API available at http://0.0.0.0:${PORT}/api/votes (GET and POST)`);
  console.log(`Health check available at http://0.0.0.0:${PORT}/api/health`);
});
