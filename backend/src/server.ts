import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import { env } from './config/env.js';
import { setSocketIO } from './controllers/newsController.js';
import { fetchCryptoNews } from './services/newsService.js';
import { batchSentiment } from './services/sentimentService.js';

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

setSocketIO(io);

// ---------- WebSocket real-time feed ----------
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// ---------- Periodic sentiment refresh (every 5 min) ----------
const startPeriodicJob = async () => {
  const run = async () => {
    try {
      const articles = await fetchCryptoNews();
      const sentiments = await batchSentiment(articles);
      io.emit('sentiment-update', sentiments.slice(0, 10));
    } catch (e) {
      console.error('Periodic job error', e);
    }
  };

  await run(); // immediate first run
  setInterval(run, 5 * 60 * 1000);
};

startPeriodicJob();

const PORT = env.PORT;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});