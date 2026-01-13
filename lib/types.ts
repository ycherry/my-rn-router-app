//统一管理项目中所有共享的 TypeScript 接口和类型
export interface CodeImplementation {
  id: number;
  title: string;
  description: string;
  code: string;
  author: string;
  votes: number;
  pros: string[];
  cons: string[];
  tags: string[];
}

export interface ArenaBattle {
  id: number;
  title: string;
  description: string;
  category: string;
  implementations: CodeImplementation[];
  totalVotes: number;
  createdAt: string;
}

export interface UserVotingRecord {
  battle: ArenaBattle;
  implementation: CodeImplementation;
  votedAt: string;
}