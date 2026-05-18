import User from '../schema/User.js';
import bcrypt from 'bcryptjs';

//get
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.log("user not found");
      return;
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
};

//register; post
export const createUser = async (req, res) => {
  try {
    const { username, email, password, text } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt)

    const newUser = await User.create({ username, email, password: hashPass, text });
    res.status(201).json({ status: "user created" });
  } catch (error) {
    res.status(400).json({ status: "failed to create user", message: error.message })
  }
};

//update  - separate from email/password update; PATCH
export const updateUser = async (req, res) => {
  try {
    const { text } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true }
    );
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
}

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({ status: "success", data: deletedUser });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
}

/*
//post
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email/password" });
    }

  } catch
}
*/

//TODO: way of updating email/password
