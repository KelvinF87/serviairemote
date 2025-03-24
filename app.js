import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());

app.use('/api', chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});