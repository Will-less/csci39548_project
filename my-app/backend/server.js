import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Text from './schema/Text.js';


dotenv.config({ path: './config.env' });

const app = express();
app.use(cors());
app.use(express.json())

const PORT = process.env.PORT || 3000;

async function connectToCloud() {
  try {
    //either create a db named library or remove {dbName: 'library'} when you are testing
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'library' });
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
const text = await Text.create({ title: "Steins;Gate", content: "this is a test" });
text.save().then(() => console.log("saved data"));
