/**
 * Battles API - Get all battles with implementations
 */
import { BattleService } from '@/services/battleService';
import { json } from '@tanstack/start';

export async function GET() {
  try {
    const battles = await BattleService.getAllWithImplementations();
    return json({ data: battles, total: battles.length });
  } catch (error) {
    console.error('Error fetching battles:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
