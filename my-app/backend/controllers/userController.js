import User from '../schema/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

//get
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.log("user not found");
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
};

//register; post
export const createUser = async (req, res) => {
  console.log("BODY RECIEVED:", req.body)
  try {
    const { username, email, password, text } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt)

    const newUser = await User.create({ username, email, password: hashPass, text });
    res.status(201).json({ status: "user created" });
  } catch (error) {
    console.log("Error:", error);
    if (error?.code === 11000) {
      const field = error.keys ? Object.keys(error.keyPattern)[0] : null;
      let message = "Duplicated field error";

      if (field === "email") message = "Email already registered";
      if (field === "username") message = "Username already taken";

      return res.status(400).json({ message });
    }
    return res.status(400).json({
      message: error.message || "Something went wrong"
    });
  }
};

//update  - separate from email/password update; PATCH
//appends, so use this for storing new documents 
export const updateText = async (req, res) => {
  try {
    const { text } = req.body;

    const id = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { text: text } },
      { returnDocument: 'after' }
    );
    return res.status(200).json({ status: "success", data: updatedUser });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
}

//overwrites text and is to be called when there is an existing id 
//also patch 
export const overwriteText = async (req, res) => {
  try {
    const { text } = req.body;
    const id = req.user.id;
    const { textId } = req.params;

    const newDocument = {
      ...text,
      _id: textId
    }

    const updatedUser = await User.findOneAndUpdate({
      _id: id,
      "text._id": textId
    }, {
      $set: { "text.$": newDocument }
    }, { returnDocument: 'after' }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//delete
export const deleteText = async (req, res) => {
  try {
    const id = req.user.id;
    const { textId } = req.params;
    console.log(textId);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "user somehow not found" });
    }

    const converted = new mongoose.Types.ObjectId(textId)

    user.text.pull({ _id: converted });

    /*
    const deletedText = await User.findOneAndUpdate({
      _id: id,
    }, {
      $pull: {
        text: { _id: converted }
      }
    },
      { returnDocument: 'after' }
    );
    */
    await user.save();

    res.status(200).json(user);
  }
  catch (error) {
    res.status(500).json({ error: error.message, error_stack: error.stack });
  }
}

export const authUser = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer')) {
    console.log("hello");
    return res.status(401).json({ error: "token required" });
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: 'request not authorized' });
  }
}

//maybe add if we have time
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
