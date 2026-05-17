import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js'


const app = express();
app.use(cors());

dotenv.config({ path: './.env' });
app.use(express.json())
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;

async function connectToCloud() {
  try {
    //either create a db named library or remove {dbName: 'users'} when you are testing
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'users' });
    console.log("successfully connected to MongoDB Atlas Cloud!");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  } catch (e) {
    console.error("failure:", e.message);
    process.exit(1);
  }
}

connectToCloud();
