// src/services/sentimentService.ts
import Sentiment from 'sentiment'; // This is the constructor
import type { NewsArticle } from './newsService.js';
import { firestore } from '../config/firebase.js';

// Define the instance type
type SentimentInstance = InstanceType<typeof Sentiment>;
type AnalysisResult = ReturnType<SentimentInstance['analyze']>;

const sentiment = new Sentiment();

export interface SentimentResult {
  articleUrl: string;
  title: string;
  score: number;
  comparative: number;
  positiveWords: string[];
  negativeWords: string[];
  timestamp: number;
}

export const analyseHeadline = (headline: string): AnalysisResult => {
  return sentiment.analyze(headline);
};

export const storeSentiment = async (result: SentimentResult) => {
  await firestore.collection('sentiments').add(result);
};

export const batchSentiment = async (articles: NewsArticle[]) => {
  const results: SentimentResult[] = [];

  for (const art of articles) {
    const text = `${art.title} ${art.description ?? ''}`.trim();
    if (!text) continue;

    const analysis = sentiment.analyze(text);
    const result: SentimentResult = {
      articleUrl: art.url,
      title: art.title,
      score: analysis.score,
      comparative: analysis.comparative,
      positiveWords: analysis.positive,
      negativeWords: analysis.negative,
      timestamp: Date.now(),
    };

    results.push(result);
    await storeSentiment(result);
  }

  return results;
};