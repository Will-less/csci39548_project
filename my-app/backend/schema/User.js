import mongoose from 'mongoose';
import { textSchema } from './Text.js';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'An email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, '...']
  },
  password: {
    //please don't just put the raw password
    type: String,
    required: [true, 'A password is required'],
    minLength: 8,
    select: false
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now()
  },
  text: {
    type: [textSchema],
    default: []
  }
});

const User = mongoose.model("User", userSchema);
export default User;
