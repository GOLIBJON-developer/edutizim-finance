
import dotenv from 'dotenv';
dotenv.config();

import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import financeRoutes from './routes/finance.routes';



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API marshrutlari
app.use('/api', financeRoutes);

// Health-check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server http://localhost:${PORT} portida ishga tushdi.`);
    });
  });
}

export default app;