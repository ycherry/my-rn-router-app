/**
 * Battles API - Get all battles with implementations
 */
import { BattleService } from '@/services/battleService';

export async function GET() {
  try {
    const battles = await BattleService.getAllWithImplementations();
    return Response.json({ data: battles, total: battles.length });
  } catch (error) {
    console.error('Error fetching battles:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
