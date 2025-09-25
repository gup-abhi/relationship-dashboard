import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mainRouter from './routes/index.js';
import demographicsRouter from './routes/demographics.js';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Connect to Database
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


// Routes
app.use('/api', mainRouter);
app.use('/api/demographics', demographicsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Serve the exported Next.js static site
app.use(express.static(path.join(__dirname, '../../frontend/out')));

// For any non-API routes, always return index.html (for SPA routing)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/out/index.html'));
});

const PORT = process.env.PORT || 5000;

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});