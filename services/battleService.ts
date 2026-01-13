import { battlesDao } from '@/db/models/daos/battles';
import { db } from '@/db';
import { battles, implementations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const BattleService = {
  async findById(id: number) {
    return await battlesDao.findById(id);
  },

  async findAll() {
    return await battlesDao.findAll();
  },

  async findByCreatedBy(createdBy: string) {
    return await battlesDao.findByCreatedBy(createdBy);
  },

  async create(data: typeof battles.$inferInsert) {
    return await battlesDao.create(data);
  },

  async update(id: number, data: Partial<typeof battles.$inferInsert>) {
    return await battlesDao.update(id, data);
  },

  async delete(id: number) {
    await battlesDao.delete(id);
  },

  // 获取所有battles，包括implementations
  async getAllWithImplementations() {
    const result = await db
      .select({
        id: battles.id,
        title: battles.title,
        description: battles.description,
        category: battles.category,
        totalVotes: battles.totalVotes,
        createdAt: battles.createdAt,
        implementations: implementations,
      })
      .from(battles)
      .leftJoin(implementations, eq(battles.id, implementations.battleId));

    // 数据分组处理
    const battlesMap = new Map();
    result.forEach((row) => {
      if (!battlesMap.has(row.id)) {
        battlesMap.set(row.id, {
          id: row.id,
          title: row.title,
          description: row.description,
          category: row.category,
          totalVotes: row.totalVotes,
          createdAt: row.createdAt,
          implementations: [],
        });
      }
      if (row.implementations) {
        battlesMap.get(row.id).implementations.push(row.implementations);
      }
    });

    return [...battlesMap.values()];
  },

  // 根据ID获取单个battle，包括implementations
  async getByIdWithImplementations(id: number) {
    const result = await db
      .select({
        id: battles.id,
        title: battles.title,
        description: battles.description,
        category: battles.category,
        totalVotes: battles.totalVotes,
        createdAt: battles.createdAt,
        implementations: implementations,
      })
      .from(battles)
      .leftJoin(implementations, eq(battles.id, implementations.battleId))
      .where(eq(battles.id, id));

    if (result.length === 0) return null;

    const battle = {
      id: result[0]!.id,
      title: result[0]!.title,
      description: result[0]!.description,
      category: result[0]!.category,
      totalVotes: result[0]!.totalVotes,
      createdAt: result[0]!.createdAt,
      implementations: result
        .filter(row => row.implementations)
        .map(row => row.implementations!),
    };

    return battle;
  },

  // 创建新battle和implementations
  async createWithImplementations(data: {
    title: string;
    description: string;
    category: string;
    implementations: Array<{
      title: string;
      description: string;
      code: string;
      author: string;
      pros: string[];
      cons: string[];
      tags: string[];
    }>;
  }) {
    const [newBattle] = await db.insert(battles).values({
      title: data.title,
      description: data.description,
      category: data.category,
    }).returning({ id: battles.id });

    if (!newBattle) {
      throw new Error("Failed to create battle");
    }

    if (data.implementations.length > 0) {
      await db.insert(implementations).values(
        data.implementations.map(impl => ({
          battleId: newBattle.id,
          title: impl.title,
          description: impl.description,
          code: impl.code,
          author: impl.author,
          pros: impl.pros,
          cons: impl.cons,
          tags: impl.tags,
        }))
      );
    }

    return newBattle;
  },
};