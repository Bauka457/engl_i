import dotenv from 'dotenv';
import express from 'express';
import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dailyPlanHandler } from './src/services/daily-plan-handler';
import { tutorChatHandler } from './src/services/tutor-chat-handler';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
app.use(express.json({ limit: '4mb' }));

app.post('/api/daily-plan', dailyPlanHandler);
app.post('/api/tutor-chat', tutorChatHandler);

const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--production');
if (isProduction) {
  const distDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
  app.use(express.static(distDirectory));
  app.get('*', (_request, response) => {
    response.sendFile(path.join(distDirectory, 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
}

const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => {
  console.log(`English Journey ready at http://localhost:${port}`);
});