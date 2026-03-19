import { Request, Response } from 'express';
import { fetchCryptoNews } from '../services/newsService.js';
import { batchSentiment } from '../services/sentimentService.js';
import { Server } from 'socket.io';

let io: Server | null = null;
export const setSocketIO = (socketIo: Server) => (io = socketIo);

export const getLatestNews = async (_req: Request, res: Response) => {
  try {
    const articles = await fetchCryptoNews();
    const sentiments = await batchSentiment(articles);

    // push real-time to all connected clients
    io?.emit('sentiment-update', sentiments.slice(0, 10));

    res.json({ articles, sentiments });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};