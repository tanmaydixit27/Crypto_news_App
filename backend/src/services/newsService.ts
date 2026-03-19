// src/services/newsService.ts
import axios from 'axios';

export interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  publishedAt: string; // ISO string
  source: { name: string };
}

/**
 * Fetch latest crypto news from CryptoCompare (FREE, no key)
 */
export const fetchCryptoNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await axios.get<{
      Data: Array<{
        title: string;
        body: string;
        url: string;
        published_on: number;
        source_info: { name: string };
      }>;
    }>('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');

    const articles = response.data.Data;

    return articles.slice(0, 30).map((item) => ({
      title: item.title,
      description:
        item.body.length > 250
          ? item.body.substring(0, 247) + '...'
          : item.body || null,
      url: item.url,
      publishedAt: new Date(item.published_on * 1000).toISOString(),
      source: { name: item.source_info.name },
    }));
  } catch (error: any) {
    console.error('CryptoCompare API Error:', error.message);
    throw new Error('Failed to fetch news');
  }
};