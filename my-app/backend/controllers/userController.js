import User from '../schema/User.js';

//get
export const getUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
};

//create; post
export const createUser = async (req, res) => {
  try {
    const { email, password, text } = req.body;
    const newUser = await User.create({ email, password, text });
    res.status(201).json({ status: "success", data: newUser });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message })
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

//TODO: way of updating email/password
