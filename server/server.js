/**
 * UrbanFix Standalone Express Server (for local VS Code MERN deployment)
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('UrbanFix Backend API is running!');
});

app.listen(PORT, () => {
  console.log(`UrbanFix API server running on port ${PORT}`);
});
