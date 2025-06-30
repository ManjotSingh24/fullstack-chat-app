import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All feilds are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    //1.
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    //2.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //3.
    const newUser = new User({
      fullName, // 4.
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //4. generate jwt token
      generateToken(newUser._id, res);
      //5. save the user to the database
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "User not created" });
    }
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    generateToken(user._id, res);

    // Send user data in response
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    // Clear the JWT cookie
    res.cookie("jwt", "", {
      maxAge: 0, // Set the cookie to expire immediately
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {

  try{
      const {profilePic} = req.body;
      const userId = req.user._id; // Assuming req.user is set by the protectRoute middleware
      if (!profilePic) {
        return res.status(400).json({ message: "Profile picture is required" });
      }
      // Find the user by ID and update the profile picture basically below line is going to upload the profile picture to cloudinary and then update the user profilePic field with the secure url of the uploaded image
      const uploadResponse = await cloudinary.uploader.upload(profilePic)
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url }, //uploadResponse.secure_url is a feild that is send by cloudinary after uploading the image and it will contain the secure url of the uploaded image
        { new: true } // Return the updated user
      );

      res.status(200).json(updatedUser);

  }catch (error) {
    console.log("Error in updateProfile controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }

}

export const checkAuth = (req, res) => {
  try{
    res.status(200).json(req.user); // req.user is set by the protectRoute middleware
  }catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

/*
1. chech if the user already exists
2.  these salt and hash methods are static methods defined in the User model and they are used to hash the password we are using bcrypt to hash the password
3.  create a new user and this newUser is an instance of the User model we are passing the fullname, email and hashedPassword to the User model to create a new user
4. we can use shorthand property names in ES6 instead of fullname: fullname
*/
