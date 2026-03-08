import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
import authRoutes from './routes/auth';
import complaintRoutes from './routes/complaints';
import notificationRoutes from './routes/notifications';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const upload = multer({ dest: 'uploads/' });

const port = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('➡️ Connected to MongoDB');
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
  });
