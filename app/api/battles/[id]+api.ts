/**
 * Battles API - Get specific battle by ID
 */
import { BattleService } from '@/services/battleService';

export async function GET({ params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const battle = await BattleService.getByIdWithImplementations(id);
    
    if (!battle) {
      return Response.json({ error: 'Battle not found' }, { status: 404 });
    }
    
    return Response.json({ data: battle });
  } catch (error) {
    console.error('Error fetching battle:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
