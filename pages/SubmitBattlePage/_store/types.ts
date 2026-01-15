export interface ImplementationForm {
  title: string;
  description: string;
  code: string;
  author: string;
  pros: string[];
  cons: string[];
  tags: string[];
}

export interface BattleForm {
  title: string;
  description: string;
  category: string;
  implementations: ImplementationForm[];
}
