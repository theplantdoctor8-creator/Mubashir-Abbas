
export type View = 'dashboard' | 'disease' | 'advisor' | 'market';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  }
}

export interface MarketAnalysis {
  summary: string;
  sources: GroundingChunk[];
}
