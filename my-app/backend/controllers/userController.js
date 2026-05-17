import User from '../schema/User.js';

export const getUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
};

export const createUser = async (req, res) => {
  try {
  } catch {

  }
}
