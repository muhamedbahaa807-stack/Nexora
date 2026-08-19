import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import mainrouter from './routes/mainrouter.js';
import { dbConnenction } from './config/DBconnect.js';
import { errorhandler, notFound } from './middlewares/errorhandler.js';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT;
dbConnenction();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(mainrouter);
app.use(notFound);
app.use(errorhandler);
app.listen(PORT, () => console.log(`running on ${PORT}`));
