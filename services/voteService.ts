import { db } from '@/db';
import { battles, implementations, votes } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export const VoteService = {
  // 检查用户是否已经对某个implementation投票
  async hasUserVoted(userId: string, implementationId: number) {
    const result = await db
      .select()
      .from(votes)
      .where(and(
        eq(votes.userId, userId),
        eq(votes.implementationId, implementationId)
      ));

    return result.length > 0;
  },

  // 为implementation投票
  async vote(userId: string, implementationId: number) {
    // 检查是否已经投票
    const hasVoted = await this.hasUserVoted(userId, implementationId);
    if (hasVoted) {
      throw new Error('User has already voted for this implementation');
    }

    // 检查implementation是否存在
    const implementation = await db
      .select({ battleId: implementations.battleId, votes: implementations.votes })
      .from(implementations)
      .where(eq(implementations.id, implementationId))
      .limit(1);

    if (implementation.length === 0) {
      throw new Error('Implementation not found');
    }

    // 在事务中执行投票
    return await db.transaction(async (tx) => {
      // 插入投票记录
      await tx.insert(votes).values({
        userId,
        implementationId,
      });

      // 手动更新votes计数
      await tx
        .update(implementations)
        .set({ votes: implementation[0].votes + 1 })
        .where(eq(implementations.id, implementationId));

      return { success: true };
    });
  },

  // 获取用户的投票历史
  async getUserVotes(userId: string) {
    const result = await db
      .select({
        voteId: votes.id,
        implementationId: votes.implementationId,
        votedAt: votes.createdAt,
        implementation: implementations,
        battle: battles,
      })
      .from(votes)
      .innerJoin(implementations, eq(votes.implementationId, implementations.id))
      .innerJoin(battles, eq(implementations.battleId, battles.id))
      .where(eq(votes.userId, userId));

    return result.map(row => ({
      voteId: row.voteId,
      implementationId: row.implementationId,
      votedAt: row.votedAt,
      implementation: {
        id: row.implementation.id,
        title: row.implementation.title,
        description: row.implementation.description,
        code: row.implementation.code,
        author: row.implementation.author,
        votes: row.implementation.votes,
        pros: row.implementation.pros,
        cons: row.implementation.cons,
        tags: row.implementation.tags,
      },
      battle: {
        id: row.battle.id,
        title: row.battle.title,
        description: row.battle.description,
        category: row.battle.category,
        totalVotes: row.battle.totalVotes,
        createdAt: row.battle.createdAt,
      },
    }));
  },
};