import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mainRouter from './routes/index.js';
import connectDB from './config/db.js';

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', mainRouter);

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});