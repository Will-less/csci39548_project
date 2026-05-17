import mongoose from 'mongoose';

const textSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Text = mongoose.model("Text", textSchema);
export default Text;
