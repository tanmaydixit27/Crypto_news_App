// src/types/sentiment.d.ts

declare module 'sentiment' {
  export interface AnalysisResult {
    score: number;
    comparative: number;
    tokens: string[];
    words: string[];
    positive: string[];
    negative: string[];
  }

  export interface SentimentOptions {
    language?: string;
    extras?: Record<string, number>;
  }

  export interface SentimentInstance {
    analyze(phrase: string, options?: SentimentOptions): AnalysisResult;
    registerLanguage(languageCode: string, language: any): void;
  }

  interface SentimentConstructor {
    new (options?: SentimentOptions): SentimentInstance;
  }

  const Sentiment: SentimentConstructor;
  export = Sentiment;
}