import User from '../schema/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//get
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.log("user not found");
      return;
    }
    res.status(200).json(user);
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
    if (error.code === 1100) {
      if (error.keyPattern.username) {
        return res.status(400).json({
          message: "Username already taken"
        });
      }
      if (error.keyPattern.email) {
        return res.status(400).json({
          message: "Email already registerd"
        });
      }
    }
    res.status(400).json({
      message: error.message
    });
  }
};

//update  - separate from email/password update; PATCH
export const updateUser = async (req, res) => {
  try {
    const { text } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { text: text } },
      { new: true }
    );
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
}

export const authUser = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer')) {
    return res.status(401).json({ error: "token required" });
  }
  const token = header.split(" ")[1];
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'request not authorized' });
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


//post. Localstorage because of time constraints
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: "Invalid email/password" });
    }
    console.log(user);
    console.log(user.password);
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(400).json({ message: "Invalid login" });
    }
    const token = jwt.sign({
      id: user._id
    },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed", message: error.message });
  }
}

//TODO: way of updating email/password
//TODO: protected routes? 
