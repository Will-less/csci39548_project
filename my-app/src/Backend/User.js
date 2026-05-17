import mongoose from 'mongoose';
import Text from './text.js';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'An email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, '...']
  },
  password: {
    type: String,
    required: [true, 'A password is required'],
    select: false
  },
  text: {
    type: Schema.Types.ObjectId,
    ref: Text
  }
})

const User = mongoose.model("User", userSchema);
export default User;
