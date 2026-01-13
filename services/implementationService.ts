import { implementationsDao } from '@/db/models/daos/implementations';
import type { implementations } from '@/db/schema';

export const ImplementationService = {
  findById(id: number) {
    return implementationsDao.findById(id);
  },

  findByBattleId(battleId: number) {
    return implementationsDao.findByBattleId(battleId);
  },

  create(data: typeof implementations.$inferInsert) {
    return implementationsDao.create(data);
  },

  update(id: number, data: Partial<typeof implementations.$inferInsert>) {
    return implementationsDao.update(id, data);
  },

  delete(id: number) {
    implementationsDao.delete(id);
  },
};