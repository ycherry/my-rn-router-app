/**
 * Standalone Backend Server for Better Auth
 * This server runs independently to handle authentication for the React Native app
 * API routes are organized in the app/api directory for better structure
 */
import { config } from 'dotenv';
import { resolve } from 'node:path';

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') });

import cors from 'cors';
import express from 'express';
import { auth } from './lib/auth';
import { BattleService } from './services/battleService';

const app = express();
const PORT = Number(process.env.PORT) || 8000;

// Enable CORS for React Native app
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
}));

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
  console.log(`Better Auth endpoints available at http://0.0.0.0:${PORT}/api/auth/*`);
  console.log(`Battles API available at http://0.0.0.0:${PORT}/api/battles`);
  console.log(`Health check available at http://0.0.0.0:${PORT}/api/health`);
});
