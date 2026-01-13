/**
 * Health check endpoint
 */
import { json } from '@tanstack/start';

export async function GET() {
  return json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
}
