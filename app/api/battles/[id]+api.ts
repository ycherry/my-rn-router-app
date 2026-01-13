/**
 * Battles API - Get specific battle by ID
 */
import { BattleService } from '@/services/battleService';
import { json } from '@tanstack/start';

export async function GET({ params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const battle = await BattleService.getByIdWithImplementations(id);
    
    if (!battle) {
      return json({ error: 'Battle not found' }, { status: 404 });
    }
    
    return json({ data: battle });
  } catch (error) {
    console.error('Error fetching battle:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
