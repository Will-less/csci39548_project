import mongoose from 'mongoose';
import { textSchema } from './Text.js';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'A username is required'],
    unique: true,
    trim: true,
    minLength: [3, 'Username must be at least 3 characters long']
  },
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
    minLength: [8, 'password must be at least 8 characters long'],
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
